/**
 * Specific-topic checklist, scoped per primary area (keyed off
 * PRIMARY_RESEARCH_AREAS[].key from researchAreas.ts). The 'ai-ml' list is
 * the exact set given in the spec; the rest follow the same pattern for
 * their domain.
 */
export const TOPICS_BY_AREA: Record<string, string[]> = {
  'quantum-computing': [
    'Quantum Algorithms',
    'Quantum Error Correction',
    'Quantum Cryptography',
    'Quantum Hardware & Qubits',
    'Quantum Simulation',
    'Quantum Machine Learning',
    'Quantum Networking',
    'Variational Quantum Circuits',
    'Topological Quantum Computing',
  ],
  'ai-ml': [
    'Generative AI',
    'Natural Language Processing',
    'Computer Vision',
    'Explainable AI',
    'Reinforcement Learning',
    'AI for Healthcare',
    'AI for Education',
    'Large Language Models',
    'Edge AI',
  ],
  'cyber-security': [
    'Network Security',
    'Cryptography & Encryption',
    'Threat Intelligence',
    'Penetration Testing',
    'Cloud Security',
    'IoT Security',
    'Zero Trust Architecture',
    'Security Automation',
    'Digital Forensics',
  ],
  'cloud-computing': [
    'Cloud Infrastructure & DevOps',
    'Serverless Computing',
    'Kubernetes & Containers',
    'Multi-Cloud Architecture',
    'Cloud Cost Optimization',
    'Edge Computing',
    'Cloud Security & Compliance',
    'Distributed Systems Design',
  ],
  'data-science': [
    'Predictive Analytics',
    'Data Visualization',
    'Big Data Engineering',
    'Statistical Modeling',
    'Time Series Analysis',
    'Data Ethics & Privacy',
    'Business Intelligence',
    'Experimentation & A/B Testing',
  ],
  iot: [
    'Sensor Networks',
    'Smart Home Systems',
    'Industrial IoT',
    'Wearable Technology',
    'IoT Data Analytics',
    'Connectivity Protocols (5G/LoRa)',
    'Smart Agriculture',
    'IoT Security',
  ],
  robotics: [
    'Autonomous Navigation',
    'Robotic Manipulation',
    'Swarm Robotics',
    'Human-Robot Interaction',
    'Robotic Perception',
    'Industrial Automation',
    'Bio-Inspired Robotics',
    'Robot Learning',
  ],
  biotech: [
    'Genomics & Bioinformatics',
    'Synthetic Biology',
    'Drug Discovery',
    'Medical Diagnostics',
    'Biomedical Devices',
    'Computational Biology',
    'Personalized Medicine',
    'Biotech Data Science',
  ],
  'emerging-technology': [
    'Web3 & Blockchain',
    'Augmented & Virtual Reality',
    'Digital Twins',
    'Brain-Computer Interfaces',
    'Advanced Materials',
    'Space Technology',
    'Sustainable / Green Tech',
    'Neurotechnology',
  ],
};

export function getTopicsForArea(areaKey: string): string[] {
  return TOPICS_BY_AREA[areaKey] ?? [];
}
