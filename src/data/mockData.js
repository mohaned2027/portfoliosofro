import professorImg from "@/assets/professor.jpg";
export const professor = {
  id: "prof-1",
  name: "Prof. Dr. Karim A. Mansour",
  title: "Professor & Head of Department",
  department: "Communications & Electronics Engineering",
  university: "Cairo Institute of Technology",
  email: "k.mansour@cit.edu.eg",
  phone: "+20 (2) 2555 0192",
  office: "Building H, Office 412 — Faculty of Engineering",
  officeHours: "Sun & Tue, 10:00 — 13:00",
  address: "El Tahrir St., Dokki, Giza, Egypt",
  avatar: professorImg,
  bio: "Prof. Karim Mansour is a leading researcher in wireless communications, MIMO systems, and next-generation 6G networks. Over the past two decades he has supervised more than 80 graduate students and authored 120+ peer-reviewed publications. As Head of the Communications & Electronics Engineering Department, he shapes the curriculum that trains Egypt's next generation of telecommunications engineers.",
  vision: "To build a research-driven, industry-connected department that pioneers the communication technologies of tomorrow — from intelligent reflecting surfaces to satellite-IoT convergence.",
  socials: {
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    scholar: "https://scholar.google.com",
    orcid: "https://orcid.org",
    researchgate: "https://researchgate.net",
    twitter: "https://twitter.com"
  },
  skills: [{
    name: "Wireless Communications",
    level: 98
  }, {
    name: "MIMO / Massive MIMO",
    level: 95
  }, {
    name: "Signal Processing",
    level: 94
  }, {
    name: "5G / 6G Networks",
    level: 92
  }, {
    name: "Antenna Design",
    level: 88
  }, {
    name: "Machine Learning for Comms",
    level: 85
  }, {
    name: "Optical Fiber Systems",
    level: 82
  }, {
    name: "Satellite Communications",
    level: 80
  }],
  interests: ["Reconfigurable Intelligent Surfaces", "Terahertz Communications", "AI-native Air Interfaces", "Non-Terrestrial Networks", "Quantum Key Distribution", "Integrated Sensing & Communication"]
};
export const education = [{
  id: 1,
  degree: "Ph.D. in Electrical Engineering",
  school: "Imperial College London",
  year: "2005",
  focus: "MIMO channel estimation in fast-fading environments"
}, {
  id: 2,
  degree: "M.Sc. in Communications Engineering",
  school: "Technical University of Munich",
  year: "2001",
  focus: "Adaptive equalization for OFDM"
}, {
  id: 3,
  degree: "B.Sc. in Electronics & Communications",
  school: "Cairo University",
  year: "1999",
  focus: "Graduated with Honors — Top of class"
}];
export const stats = {
  publications: 124,
  courses: 18,
  awards: 22,
  experience: 21,
  students: 86,
  citations: 4_812
};
const cover = seed => `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=1200&q=70`;
const covers = [cover("1518770660439-4636190af475"), cover("1451187580459-43490279c0fa"), cover("1581090700227-1e37b190418e"), cover("1517077304055-6e89abbf09b0"), cover("1532187863486-abf9dbad1b69"), cover("1581090464777-f3220bbe1b8b"), cover("1519389950473-47ba0277781c"), cover("1504384308090-c894fdcc538d"), cover("1497032628192-86f99bcd76bc"), cover("1496096265110-f83ad7f96608")];
const pick = i => covers[i % covers.length];
export const achievements = Array.from({
  length: 20
}).map((_, i) => ({
  id: `ach-${i + 1}`,
  title: ["IEEE Best Paper Award — ICC 2025", "National Prize in Engineering Sciences", "Keynote Speaker, GlobeCom Singapore", "Editor — IEEE Trans. on Wireless Comms", "Grant: 6G Testbed, $1.4M from STDF", "Fellow of the African Academy of Sciences", "Outstanding Educator Award", "Patent: Adaptive Beamforming for RIS", "Visiting Scholar — MIT RLE", "Chair, IEEE ComSoc Egypt Chapter", "Distinguished Lecturer — IEEE VTS", "Best Demo Award, IEEE WCNC", "Founding Director, 5G Innovation Lab", "Patent: Low-PAPR OFDM Waveform", "TPC Chair — IEEE PIMRC 2024", "University Medal of Excellence", "Industry Award — Vodafone Research", "10,000+ Google Scholar Citations", "ABET Accreditation Lead", "Sustainability in Networks Award"][i],
  description: "A milestone in academic research, leadership, or community contribution to the field of communications engineering.",
  fullDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. This achievement reflects a sustained commitment to excellence in research, teaching, and academic leadership. It was awarded after rigorous peer evaluation and represents a meaningful contribution to the international research community in wireless communications and electronics engineering.",
  cover: pick(i),
  date: `${2024 - i % 10}-${String(i % 12 + 1).padStart(2, "0")}-15`,
  category: ["Award", "Grant", "Editorship", "Keynote", "Patent", "Leadership"][i % 6],
  liveLink: i % 3 === 0 ? "https://example.com/achievement" : undefined,
  gallery: [pick(i), pick(i + 1), pick(i + 2), pick(i + 3)]
}));
export const researches = Array.from({
  length: 20
}).map((_, i) => ({
  id: `res-${i + 1}`,
  title: ["Intelligent Reflecting Surfaces for 6G: A Survey", "Deep-Learning Channel Estimation for Massive MIMO", "Energy-Efficient Beamforming in mmWave Cells", "Federated Learning over Wireless Edge Networks", "Terahertz Propagation in Urban Microcells", "Hybrid NOMA-OMA for Dense IoT Networks", "Joint Sensing & Communication in 6G Air Interface", "Low-PAPR Waveforms for Satellite-IoT Convergence", "Reinforcement-Learning Power Control for D2D", "Reconfigurable Antennas for Vehicular Networks", "Privacy-Preserving Aggregation in 5G Slicing", "Quantum Key Distribution over Free-Space Optics", "Cell-Free Massive MIMO with User-Centric Clustering", "AI-Native Air Interfaces: Opportunities & Pitfalls", "Hybrid Beamforming with One-Bit ADCs", "Energy Harvesting in Backscatter Communications", "URLLC Scheduling under Bursty Traffic", "Network Coding for LEO Satellite Mesh", "Acoustic-OFDM for Underwater IoT", "Spectrum Sharing via Cognitive Radio in 6G"][i],
  year: 2026 - i % 6,
  abstract: "We present a novel framework that addresses a fundamental challenge in modern wireless systems. Through extensive simulation and an over-the-air testbed campaign, our approach demonstrates measurable improvements in spectral and energy efficiency over established baselines, while remaining tractable for real-time implementation on commodity hardware.",
  authors: ["K. A. Mansour", "S. El-Hag", "M. Rashed", "N. Farouk"].slice(0, 2 + i % 3),
  keywords: ["MIMO", "6G", "Beamforming", "Deep Learning", "OFDM", "RIS"].slice(0, 3 + i % 3),
  journal: ["IEEE Trans. Wireless Comms", "IEEE JSAC", "IEEE Trans. Comms", "IEEE Network"][i % 4],
  conference: i % 2 === 0 ? ["IEEE ICC", "IEEE GlobeCom", "IEEE WCNC"][i % 3] : undefined,
  doi: `10.1109/TWC.2026.${1000 + i}`,
  link: "https://ieeexplore.ieee.org",
  pdf: "#",
  cover: pick(i + 3)
}));
export const experiences = [{
  id: "exp-1",
  position: "Head of Department",
  organization: "Cairo Institute of Technology",
  from: "2022",
  to: "Present",
  description: "Lead strategy, curriculum, and research direction for 1,200+ undergraduates and 180 graduate students.",
  responsibilities: ["Curriculum modernization (6G, AI for Comms)", "Faculty hiring & mentorship", "Industry partnerships (Vodafone, Orange, Huawei)", "ABET re-accreditation"]
}, {
  id: "exp-2",
  position: "Full Professor",
  organization: "Cairo Institute of Technology",
  from: "2018",
  to: "Present",
  description: "Teaching graduate courses in wireless communications and supervising the Smart Radio Lab.",
  responsibilities: ["Supervise 14 active Ph.D. students", "Principal Investigator on 3 STDF grants", "Editor — IEEE Trans. Wireless Comms"]
}, {
  id: "exp-3",
  position: "Associate Professor",
  organization: "Cairo Institute of Technology",
  from: "2012",
  to: "2018",
  description: "Built the foundations of the Wireless Communications research group.",
  responsibilities: ["Launched M.Sc. track in 5G", "Established testbed lab", "Mentored 22 M.Sc. graduates"]
}, {
  id: "exp-4",
  position: "Visiting Scholar",
  organization: "MIT — Research Lab of Electronics",
  from: "2015",
  to: "2016",
  description: "Sabbatical year on millimeter-wave massive MIMO prototypes.",
  responsibilities: ["Co-developed open-source mmWave channel sounder", "Co-authored 4 IEEE publications"]
}, {
  id: "exp-5",
  position: "Assistant Professor",
  organization: "Cairo Institute of Technology",
  from: "2006",
  to: "2012",
  description: "Early academic career building courses and a research portfolio.",
  responsibilities: ["Designed 4 new graduate courses", "Secured first STDF young-scientist grant"]
}, {
  id: "exp-6",
  position: "Postdoctoral Researcher",
  organization: "Imperial College London",
  from: "2005",
  to: "2006",
  description: "Channel estimation algorithms for next-generation OFDM systems.",
  responsibilities: ["Filed 1 patent", "Published 6 journal papers"]
}, {
  id: "exp-7",
  position: "Research Intern",
  organization: "Nokia Bell Labs — Stuttgart",
  from: "2004",
  to: "2005",
  description: "Algorithm prototyping for LTE radio access network.",
  responsibilities: ["Channel sounding campaigns", "Joint pub with Bell Labs team"]
}, {
  id: "exp-8",
  position: "Teaching Assistant",
  organization: "Imperial College London",
  from: "2002",
  to: "2005",
  description: "Led tutorials for undergraduate signal processing.",
  responsibilities: ["Designed lab assignments", "Awarded TA of the Year — 2004"]
}, {
  id: "exp-9",
  position: "RF Engineer (Intern)",
  organization: "Vodafone R&D",
  from: "2000",
  to: "2001",
  description: "RF planning and drive-test analysis for early 3G rollouts.",
  responsibilities: ["Propagation model tuning", "Drive-test automation scripts"]
}, {
  id: "exp-10",
  position: "Graduate Researcher",
  organization: "TU Munich",
  from: "1999",
  to: "2001",
  description: "M.Sc. thesis on adaptive equalization for OFDM.",
  responsibilities: ["Published first-author conference paper", "Built MATLAB simulation suite"]
}];
export const positions = [{
  id: "pos-1",
  title: "Head of Department",
  organization: "Communications & Electronics Engineering — CIT",
  description: "Strategic leadership of academic programs, research direction, and faculty development.",
  icon: "crown"
}, {
  id: "pos-2",
  title: "Full Professor",
  organization: "Faculty of Engineering, CIT",
  description: "Graduate teaching and research supervision in wireless communications.",
  icon: "academic"
}, {
  id: "pos-3",
  title: "Director, Smart Radio Lab",
  organization: "CIT Research Center",
  description: "Leading a 22-person lab on 6G testbeds, RIS, and AI-native air interfaces.",
  icon: "radio"
}, {
  id: "pos-4",
  title: "Associate Editor",
  organization: "IEEE Trans. on Wireless Communications",
  description: "Handling editorial decisions on MIMO, beamforming, and intelligent surfaces.",
  icon: "editor"
}, {
  id: "pos-5",
  title: "Distinguished Lecturer",
  organization: "IEEE Vehicular Technology Society",
  description: "Delivering invited talks across 12 countries on 6G research directions.",
  icon: "mic"
}, {
  id: "pos-6",
  title: "Chair",
  organization: "IEEE ComSoc Egypt Chapter",
  description: "Building the communications-engineering community across Egyptian universities.",
  icon: "users"
}, {
  id: "pos-7",
  title: "Scientific Reviewer",
  organization: "STDF — Egyptian Science Fund",
  description: "Reviewing national research grant applications in ICT.",
  icon: "shield"
}, {
  id: "pos-8",
  title: "Academic Committee Member",
  organization: "Supreme Council of Universities",
  description: "Curriculum oversight for engineering programs nationwide.",
  icon: "scroll"
}, {
  id: "pos-9",
  title: "TPC Chair",
  organization: "IEEE PIMRC 2024",
  description: "Technical program leadership for a flagship IEEE conference.",
  icon: "calendar"
}, {
  id: "pos-10",
  title: "Industry Advisor",
  organization: "Vodafone Innovation Hub",
  description: "Advisory role on 5G-Advanced and 6G technology roadmap.",
  icon: "building"
}];
export const courses = Array.from({
  length: 10
}).map((_, i) => {
  const titles = ["Wireless Communications (ECE-501)", "Digital Signal Processing (ECE-321)", "Antenna Theory & Design (ECE-414)", "Information Theory & Coding (ECE-512)", "Optical Fiber Communications (ECE-432)", "Satellite & Space Comms (ECE-545)", "Advanced MIMO Systems (ECE-621)", "Machine Learning for Comms (ECE-633)", "5G/6G Network Architectures (ECE-641)", "RF & Microwave Engineering (ECE-411)"];
  return {
    id: `course-${i + 1}`,
    title: titles[i],
    description: "A graduate-level treatment combining rigorous mathematical foundations with hands-on labs on software-defined-radio platforms. Students complete a capstone project on a real research problem.",
    objectives: ["Master the mathematical foundations of the topic", "Implement core algorithms in MATLAB / Python", "Analyze real-world systems and trade-offs", "Produce a publication-quality project report"],
    cover: pick(i + 1),
    lectures: Array.from({
      length: 5
    }).map((_, j) => ({
      id: `lec-${i + 1}-${j + 1}`,
      title: `Lecture ${j + 1}: ${["Fundamentals", "Channel Models", "Transceiver Design", "Advanced Techniques", "Case Studies"][j]}`,
      pdf: "#",
      videoUrl: j % 2 === 0 ? "#" : undefined,
      youtubeUrl: j === 1 ? "https://youtube.com" : undefined,
      date: `2025-${String(j + 2).padStart(2, "0")}-10`
    }))
  };
});
export const blogs = Array.from({
  length: 15
}).map((_, i) => ({
  id: `blog-${i + 1}`,
  slug: `post-${i + 1}`,
  title: ["What Will 6G Really Look Like?", "Why Intelligent Surfaces Matter", "Teaching Wireless in the Age of AI", "From Theory to Testbed: A Researcher's Journey", "The Coming Convergence of Sensing and Comms", "Open-Source SDR: A Tool for Every Lab", "Mentoring Graduate Students Remotely", "Why Energy-Efficient Networks Are Non-Negotiable", "Egypt's Role in the Global 5G Story", "A Day in the Life of an Editor", "Notes from PIMRC 2024", "Bridging Industry and Academia", "How I Read 200 Papers a Year", "On Writing Clearer Technical Papers", "What I'd Tell My PhD Self"][i],
  excerpt: "A short, accessible take on a contemporary topic in communications engineering — written for students, peers, and the broader engineering community.",
  content: "## Introduction\n\nThis post explores a topic at the intersection of research and practice. Modern wireless networks have evolved far beyond their origins, and the next decade promises even more dramatic shifts.\n\n## Key Insights\n\nFirst, we should recognize that the boundary between communication and computation is dissolving. Second, energy efficiency has moved from a desirable trait to a hard constraint. Third, intelligent surfaces and AI-native air interfaces are no longer speculation — they are shipping ideas.\n\n## What This Means\n\nFor students, this is a moment of opportunity: the curriculum is being rewritten in real time, and graduates who understand both the physics and the software stack will lead.\n\n## Conclusion\n\nThe field is wide open. Choose problems that matter, build things, publish honestly.",
  cover: pick(i + 5),
  date: `2025-${String(i % 12 + 1).padStart(2, "0")}-${String(i % 27 + 1).padStart(2, "0")}`
}));
export const messages = Array.from({
  length: 30
}).map((_, i) => ({
  id: `msg-${i + 1}`,
  name: ["Ahmed Selim", "Mariam Khaled", "Omar Hassan", "Layla Naguib", "Yousef Tarek", "Sara Ibrahim", "Hassan Abdo"][i % 7],
  email: `student${i + 1}@university.edu`,
  subject: ["Request to join lab", "Question about ECE-501", "Recommendation letter", "Collaboration inquiry", "Speaking invitation"][i % 5],
  body: "Dear Professor, I hope this message finds you well. I am writing to inquire about an opportunity to collaborate on your ongoing research. I would be grateful for the chance to discuss this further at your convenience. Best regards.",
  date: `2026-0${i % 6 + 1}-${String(i % 27 + 1).padStart(2, "0")}`,
  read: i % 3 === 0
}));
export const media = Array.from({
  length: 18
}).map((_, i) => ({
  id: `media-${i + 1}`,
  name: ["channel-model.pdf", "lab-photo.jpg", "syllabus.docx", "conference-keynote.jpg", "research-poster.pdf", "diploma.jpg"][i % 6],
  type: ["image", "pdf", "doc"][i % 3],
  url: pick(i + 2),
  size: `${(0.5 + i % 8 * 0.4).toFixed(1)} MB`,
  uploadedAt: `2026-0${i % 6 + 1}-${String(i % 27 + 1).padStart(2, "0")}`
}));
export const dashboardCharts = {
  monthlyVisits: Array.from({
    length: 12
  }).map((_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    visits: 1200 + Math.round(Math.sin(i / 1.6) * 600 + i * 90),
    downloads: 400 + Math.round(Math.cos(i / 2) * 200 + i * 35)
  })),
  contentBreakdown: [{
    name: "Researches",
    value: researches.length
  }, {
    name: "Courses",
    value: courses.length
  }, {
    name: "Blogs",
    value: blogs.length
  }, {
    name: "Achievements",
    value: achievements.length
  }],
  recentActivities: [{
    id: 1,
    action: "New research published",
    target: researches[0].title,
    time: "2h ago"
  }, {
    id: 2,
    action: "Course updated",
    target: courses[0].title,
    time: "5h ago"
  }, {
    id: 3,
    action: "Message received",
    target: messages[0].subject,
    time: "1d ago"
  }, {
    id: 4,
    action: "Achievement added",
    target: achievements[0].title,
    time: "2d ago"
  }, {
    id: 5,
    action: "Blog post drafted",
    target: blogs[0].title,
    time: "3d ago"
  }]
};