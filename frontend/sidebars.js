// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  textbookSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['ch1-introduction-to-physical-ai'],
    },
    {
      type: 'category',
      label: 'Humanoid Robotics',
      items: ['ch2-basics-of-humanoid-robotics'],
    },
    {
      type: 'category',
      label: 'ROS 2 Fundamentals',
      items: ['ch3-ros-2-fundamentals'],
    },
    {
      type: 'category',
      label: 'Digital Twin Simulation',
      items: ['ch4-digital-twin-simulation'],
    },
    {
      type: 'category',
      label: 'Vision-Language-Action Systems',
      items: ['ch5-vision-language-action-systems'],
    },
    {
      type: 'category',
      label: 'Capstone Project',
      items: ['ch6-capstone-simple-ai-robot-pipeline'],
    },
  ],
};

module.exports = sidebars;