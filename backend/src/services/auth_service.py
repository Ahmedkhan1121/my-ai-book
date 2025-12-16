import os
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import logging
from passlib.context import CryptContext
from fastapi import HTTPException, status, Request
from pydantic import BaseModel

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[str] = None

class User(BaseModel):
    id: str
    username: str
    email: str
    is_active: bool = True
    created_at: datetime = None
    updated_at: datetime = None

class UserInDB(User):
    hashed_password: str

class AuthTokens(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class AuthCredentials(BaseModel):
    username: str
    password: str

class AuthService:
    """
    Authentication service using JWT tokens
    """
    def __init__(self):
        # In a real implementation, this would connect to a database
        # For now, we'll use an in-memory store
        self.users_db: Dict[str, UserInDB] = {}
        logger.info("Authentication service initialized")

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a plain password against a hashed password
        """
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """
        Hash a password
        """
        return pwd_context.hash(password)

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """
        Create an access token
        """
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def create_refresh_token(self, data: dict) -> str:
        """
        Create a refresh token
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def decode_token(self, token: str) -> Optional[TokenData]:
        """
        Decode a JWT token and return the token data
        """
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            user_id: str = payload.get("user_id")
            token_type: str = payload.get("type")

            if username is None or token_type != "access":
                return None
            token_data = TokenData(username=username, user_id=user_id)
        except jwt.PyJWTError:
            return None
        return token_data

    async def authenticate_user(self, username: str, password: str) -> Optional[User]:
        """
        Authenticate a user by username and password
        """
        user = self.get_user(username)
        if not user:
            return None
        if not self.verify_password(password, user.hashed_password):
            return None
        return user

    def get_user(self, username: str) -> Optional[UserInDB]:
        """
        Get a user from the database by username
        """
        return self.users_db.get(username)

    def create_user(self, username: str, email: str, password: str) -> Optional[User]:
        """
        Create a new user
        """
        if username in self.users_db:
            return None  # User already exists

        hashed_password = self.get_password_hash(password)
        user_id = f"user_{len(self.users_db) + 1}"  # Simple ID generation

        user = UserInDB(
            id=user_id,
            username=username,
            email=email,
            hashed_password=hashed_password,
            created_at=datetime.utcnow()
        )

        self.users_db[username] = user
        logger.info(f"Created user: {username}")
        return user

    def create_auth_tokens(self, user: User) -> AuthTokens:
        """
        Create both access and refresh tokens for a user
        """
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self.create_access_token(
            data={"sub": user.username, "user_id": user.id},
            expires_delta=access_token_expires
        )
        refresh_token = self.create_refresh_token(
            data={"sub": user.username, "user_id": user.id}
        )

        return AuthTokens(
            access_token=access_token,
            refresh_token=refresh_token
        )

    async def get_current_user(self, token: str) -> Optional[User]:
        """
        Get the current user from the token
        """
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        token_data = self.decode_token(token)
        if token_data is None:
            raise credentials_exception

        user = self.get_user(username=token_data.username)
        if user is None:
            raise credentials_exception

        return User(
            id=user.id,
            username=user.username,
            email=user.email,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at
        )

    def refresh_access_token(self, refresh_token: str) -> Optional[AuthTokens]:
        """
        Refresh an access token using a refresh token
        """
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            user_id: str = payload.get("user_id")
            token_type: str = payload.get("type")

            if username is None or token_type != "refresh":
                return None

            # Verify user still exists
            user = self.get_user(username)
            if not user:
                return None

            # Create new tokens
            new_access_token = self.create_access_token(
                data={"sub": username, "user_id": user_id},
                expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            )
            new_refresh_token = self.create_refresh_token(
                data={"sub": username, "user_id": user_id}
            )

            return AuthTokens(
                access_token=new_access_token,
                refresh_token=new_refresh_token
            )
        except jwt.PyJWTError:
            return None

# Global auth service instance
auth_service = AuthService()