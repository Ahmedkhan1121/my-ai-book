---
id: ch3-ros-2-fundamentals
title: ROS 2 Fundamentals
sidebar_label: Chapter 3
chapter_number: 3
learning_objectives:
  - Understand the basics of ROS 2
  - Learn about ROS 2 architecture and components
  - Explore ROS 2 packages, nodes, and communication
---

# ROS 2 Fundamentals

ROS 2 (Robot Operating System 2) is a flexible framework for writing robot software. It is a collection of tools, libraries, and conventions that aim to simplify the task of creating complex and robust robot behavior across a wide variety of robot platforms. ROS 2 is the successor to the original ROS (Robot Operating System) and addresses many of the limitations of the original system.

## What is ROS 2?

ROS 2 is not an operating system in the traditional sense, but rather a middleware framework that provides services designed for a heterogeneous computer cluster. It includes hardware abstraction, device drivers, libraries, visualizers, message-passing, package management, and more. ROS 2 is licensed under the open-source BSD license and is maintained by Open Robotics.

ROS 2 is designed to be:
- **Distributed**: ROS 2 can run on multiple machines
- **Modular**: Components can be developed and tested independently
- **Language independent**: Supports multiple programming languages
- **Real-time capable**: Designed with real-time applications in mind
- **Secure**: Includes security features for sensitive applications

## ROS 2 vs ROS 1

ROS 2 was developed to address several limitations of the original ROS:

### Architectural Differences
- **Communication**: ROS 2 uses DDS (Data Distribution Service) as the underlying communication layer, while ROS 1 used its own custom communication protocol
- **Real-time support**: ROS 2 has better real-time capabilities
- **Security**: ROS 2 includes built-in security features
- **Multi-robot systems**: Better support for multi-robot systems
- **Cross-platform**: Improved support for different operating systems (Linux, Windows, macOS)

### New Features in ROS 2
- **Quality of Service (QoS)**: Configurable communication reliability
- **Lifecycle nodes**: Better management of node states
- **Composition**: Ability to run multiple nodes in the same process
- **Better build system**: Uses CMake and colcon for building packages

## Core Concepts

### Nodes
A node is a process that performs computation. ROS 2 is designed to have many nodes that all work together to perform complex robot behaviors. Nodes written in different programming languages can be run on different machines, but they all use the same underlying communication mechanisms.

In ROS 2, nodes are instances of node classes and are typically contained within packages. Each node should perform a specific, narrowly focused task. For example, one node might handle sensor data processing while another handles path planning.

### Packages
Packages are the fundamental building blocks of ROS 2. A package contains nodes, libraries, configuration files, and other resources needed to perform specific functions. Each package has a unique name and contains a package.xml file that describes the package's dependencies and metadata.

A package typically contains:
- Source code files
- Configuration files
- Launch files
- Test files
- Documentation
- Dependencies list

### Topics and Messages
Communication between nodes in ROS 2 happens through topics. A topic is a named bus over which nodes exchange messages. Messages are data structures that are passed between nodes subscribed to a topic.

**Publishers and Subscribers**:
- **Publisher**: A node that sends messages to a topic
- **Subscriber**: A node that receives messages from a topic

The communication is asynchronous, meaning that publishers and subscribers do not need to be active at the same time for communication to occur. Messages are published to a topic and remain available for any current or future subscribers.

### Services
Services provide a synchronous request/response communication pattern. A service client sends a request to a service server, which processes the request and sends back a response. This is different from the asynchronous topic-based communication.

Services are useful for operations that require a definitive response, such as:
- Saving a map
- Executing a specific action
- Retrieving configuration parameters

### Actions
Actions are a more advanced form of communication that combines the features of topics and services. They are designed for long-running tasks that:
- Provide feedback during execution
- Can be canceled
- Return a result when completed

Actions are ideal for tasks like:
- Navigation to a goal
- Moving a robot arm to a specific position
- Following a trajectory

## ROS 2 Architecture

### DDS (Data Distribution Service)
DDS is the underlying communication middleware that ROS 2 uses. It provides:
- **Discovery**: Automatic discovery of nodes on the network
- **Data sharing**: Efficient sharing of data between nodes
- **Quality of Service**: Configurable reliability and performance parameters
- **Security**: Built-in security features

### RMW (ROS Middleware)
The ROS Middleware (RMW) layer abstracts the underlying DDS implementation, allowing ROS 2 to work with different DDS vendors (OpenDDS, Fast DDS, Cyclone DDS, etc.).

### Client Libraries
ROS 2 provides client libraries for different programming languages:
- **rclcpp**: C++ client library
- **rclpy**: Python client library
- **rclrs**: Rust client library (in development)
- **rclc**: C client library

## Setting Up ROS 2

### Installation
ROS 2 can be installed on various platforms:
- Ubuntu Linux
- Windows 10/11
- macOS
- Docker containers

The installation process typically involves:
1. Setting up the environment
2. Installing ROS 2 packages
3. Sourcing the ROS 2 environment
4. Installing additional packages as needed

### Workspace Structure
A typical ROS 2 workspace has the following structure:
```
workspace_folder/
├── src/
│   ├── package1/
│   ├── package2/
│   └── ...
├── build/
├── install/
└── log/
```

- **src/**: Source code for packages
- **build/**: Compiled code
- **install/**: Installation directory for built packages
- **log/**: Log files

## Creating a Simple ROS 2 Package

### Package Structure
A basic ROS 2 package includes:
```
my_package/
├── CMakeLists.txt
├── package.xml
├── src/
│   └── my_node.cpp
├── include/
│   └── my_package/
│       └── my_header.hpp
├── launch/
│   └── my_launch.py
├── config/
│   └── my_params.yaml
└── test/
    └── test_my_node.cpp
```

### Basic Node Example
Here's a simple ROS 2 node in Python:

```python
import rclpy
from rclpy.node import Node

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World: %d' % self.i
        self.publisher_.publish(msg)
        self.get_logger().info('Publishing: "%s"' % msg.data)
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)
    minimal_publisher.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## ROS 2 Tools

### Command Line Tools
ROS 2 provides various command-line tools:
- `ros2 run`: Run a node from a package
- `ros2 launch`: Launch a launch file
- `ros2 topic`: View and interact with topics
- `ros2 service`: View and interact with services
- `ros2 action`: View and interact with actions
- `ros2 node`: View and interact with nodes
- `ros2 param`: View and modify parameters

### Visualization Tools
- **RViz2**: 3D visualization tool for robot data
- **rqt**: Graphical user interface framework
- **Foxglove**: Web-based visualization and debugging tool

## Best Practices

### Package Design
- Keep packages focused on a single purpose
- Use descriptive package names
- Document your packages well
- Include tests and examples

### Node Design
- Keep nodes focused on a single task
- Use parameters for configuration
- Implement proper error handling
- Use appropriate logging levels

### Communication Patterns
- Use topics for continuous data streams
- Use services for request/response interactions
- Use actions for long-running tasks with feedback

## ROS 2 Ecosystem

### Official Distributions
ROS 2 follows a time-based release schedule with long-term support (LTS) releases:
- **Foxy Fitzroy** (June 2020) - LTS
- **Galactic Geochelone** (May 2021)
- **Humble Hawksbill** (May 2022) - LTS
- **Iron Irwini** (May 2023)
- **Jazzy Jalisco** (May 2024) - LTS

### Popular Packages
- **navigation2**: Navigation stack for mobile robots
- **moveit2**: Motion planning framework
- **vision_opencv**: OpenCV integration
- **tf2**: Transform library
- **robot_state_publisher**: Robot state publishing
- **joint_state_publisher**: Joint state publishing

## Applications

ROS 2 is used in various applications:
- Academic research
- Industrial automation
- Service robots
- Autonomous vehicles
- Agricultural robots
- Medical robots
- Space exploration

## Future of ROS 2

The ROS 2 ecosystem continues to evolve with:
- Improved real-time capabilities
- Enhanced security features
- Better integration with cloud services
- Increased adoption in industry
- Growing community and package ecosystem

In the next chapter, we will explore digital twin simulation using Gazebo and Isaac, which are important tools for testing and validating ROS 2-based robotic systems.