/**
 * Canonical research-area/domain list. Mirrors the `domains` list interns
 * choose from in the internship application form
 * (src/app/internship/components/InternshipApplicationForm.tsx). Used as
 * suggestions for mentor expertise tagging until a dedicated Research Areas
 * admin page/table exists — swap this for a real fetch once that's built.
 */
export const RESEARCH_AREAS = [
  'Quantum Computing',
  'Quantum Communication & QKD',
  'Quantum Sensing & Metrology',
  'Quantum Medical Imaging',
  'Quantum AI & Machine Learning',
  'Quantum Education & L&D',
  'Quantum Financial Systems',
  'Quantum Cybersecurity',
  'Quantum Photonics',
  'Deep-Tech Entrepreneurship',
  'Quantum Policy & Governance',
];

/**
 * The primary research areas an intern picks from on the
 * /portal/intern/research/area selector (Prompt 11). Deliberately a
 * separate, broader list from RESEARCH_AREAS above — this is the intern's
 * own top-level domain choice (saved to internships.primary_area), not a
 * mentor-expertise tag. `blurb` is the one-line description shown under
 * each card's label so the grid reads as a small map of what's available
 * rather than a bare list of names.
 */
export interface PrimaryResearchArea {
  key: string;
  label: string;
  blurb: string;
}

export const PRIMARY_RESEARCH_AREAS: PrimaryResearchArea[] = [
  { key: 'quantum-computing', label: 'Quantum Computing', blurb: 'Qubits, gates & algorithms beyond classical limits' },
  { key: 'ai-ml', label: 'AI & ML', blurb: 'Models, agents & systems that learn from data' },
  { key: 'cyber-security', label: 'Cyber Security', blurb: 'Threats, defenses & securing digital systems' },
  { key: 'cloud-computing', label: 'Cloud Computing', blurb: 'Scalable infrastructure & distributed systems' },
  { key: 'data-science', label: 'Data Science', blurb: 'Insights, statistics & data-driven decisions' },
  { key: 'iot', label: 'IoT', blurb: 'Connected devices bridging physical & digital' },
  { key: 'robotics', label: 'Robotics', blurb: 'Autonomous machines & embodied intelligence' },
  { key: 'biotech', label: 'BioTech', blurb: 'Biology meets engineering & computation' },
  { key: 'emerging-technology', label: 'Emerging Technology', blurb: 'Frontier ideas not yet mainstream' },
];
