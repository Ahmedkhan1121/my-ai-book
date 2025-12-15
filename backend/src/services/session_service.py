from typing import Dict, Set
from fastapi import WebSocket
import asyncio
import json

class SessionService:
    """
    Service for managing user sessions and WebSocket connections
    """
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        """
        Connect a WebSocket to a session
        """
        await websocket.accept()
        if session_id not in self.active_connections:
            self.active_connections[session_id] = set()
        self.active_connections[session_id].add(websocket)

    def disconnect(self, websocket: WebSocket, session_id: str):
        """
        Disconnect a WebSocket from a session
        """
        if session_id in self.active_connections:
            self.active_connections[session_id].remove(websocket)
            if not self.active_connections[session_id]:
                del self.active_connections[session_id]

    async def process_message(self, websocket: WebSocket, session_id: str, data: str):
        """
        Process a message from a WebSocket connection
        """
        try:
            message_data = json.loads(data)
            message_type = message_data.get("type", "unknown")

            if message_type == "ping":
                await self.send_personal_message(websocket, {"type": "pong", "timestamp": asyncio.get_event_loop().time()})
            elif message_type == "status_request":
                await self.send_personal_message(websocket, {"type": "status", "session_id": session_id, "status": "active"})
            else:
                await self.send_personal_message(websocket, {"type": "error", "message": "Unknown message type"})
        except json.JSONDecodeError:
            await self.send_personal_message(websocket, {"type": "error", "message": "Invalid JSON"})

    async def send_personal_message(self, websocket: WebSocket, message: Dict):
        """
        Send a message to a specific WebSocket connection
        """
        await websocket.send_text(json.dumps(message))

    async def broadcast_to_session(self, session_id: str, message: Dict):
        """
        Broadcast a message to all connections in a session
        """
        if session_id in self.active_connections:
            for connection in self.active_connections[session_id].copy():
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    # If sending fails, disconnect the connection
                    self.disconnect(connection, session_id)