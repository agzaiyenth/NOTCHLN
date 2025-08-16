// Comprehensive Government Service Document Requirements Database
// Based on official Sri Lankan government sources - Updated 2024

export interface DocumentRequirement {
  name: string
  required: boolean
  description: string
  notes?: string
}

export interface ServiceRequirement {
  id: string
  name: string
  category: string
  description: string
  fee: string
  processingTime: string
  location: string[]
  documents: DocumentRequirement[]
  additionalInfo: string[]
  urgentService?: {
    available: boolean
    fee?: string
    processingTime?: string
    location?: string[]
  }
}

export const GOVERNMENT_SERVICES: ServiceRequirement[] = [
  {
    id: "nic-replacement-lost",
    name: "NIC Replacement (Lost)",
    category: "Identity Documents",
    description: "Replace a lost National Identity Card",
    fee: "Rs. 1,000",
    processingTime: "7-14 working days",
    location: ["Department of Registration of Persons offices", "Divisional Secretariat offices"],
    documents: [
      {
        name: "Police Report",
        required: true,
        description: "Original copy of police complaint for lost NIC from nearest police station",
      },
      {
        name: "Application Form",
        required: true,
        description: "Duly completed Form D.R.P/1,7,8",
      },
      {
        name: "Birth Certificate",
        required: true,
        description: "Original birth certificate or extract certified by Additional District Registrar",
      },
      {
        name: "Photograph",
        required: true,
        description: "ICAO standard photograph obtained within 6 months",
      },
      {
        name: "Payment Receipt",
        required: true,
        description: "Receipt of payment for Rs. 1,000 application fee",
      },
    ],
    additionalInfo: [
      "Application must be forwarded through a certifying officer (Grama Niladhari or Estate Superintendent)",
      "Grama Niladhari certification requires counter-signature from Divisional Secretary",
      "Bring original documents and photocopies",
    ],
    urgentService: {
      available: true,
      fee: "Rs. 3,000 (Rs. 1,000 + Rs. 2,000 urgent fee)",
      processingTime: "Same day",
      location: ["DRP Head Office Battaramulla", "Galle Provincial Office"],
    },
  },
  {
    id: "nic-replacement-damaged",
    name: "NIC Replacement (Damaged/Amendment)",
    category: "Identity Documents",
    description: "Replace damaged NIC or amend incorrect information",
    fee: "Rs. 500",
    processingTime: "7-14 working days",
    location: ["Department of Registration of Persons offices", "Divisional Secretariat offices"],
    documents: [
      {
        name: "Application Form",
        required: true,
        description: "Duly completed Form D.R.P/1,7,8",
      },
      {
        name: "Damaged NIC",
        required: true,
        description: "Previously used National Identity Card (damaged/illegible)",
      },
      {
        name: "Birth Certificate",
        required: true,
        description: "Original birth certificate or extract certified by Additional District Registrar",
      },
      {
        name: "Photograph",
        required: true,
        description: "ICAO standard photograph obtained within 6 months",
      },
      {
        name: "Payment Receipt",
        required: true,
        description: "Receipt of payment for Rs. 500 application fee",
      },
    ],
    additionalInfo: [
      "Application must be forwarded through a certifying officer",
      "For information amendments, provide supporting documents for changes",
    ],
    urgentService: {
      available: true,
      fee: "Rs. 2,500 (Rs. 500 + Rs. 2,000 urgent fee)",
      processingTime: "Same day",
      location: ["DRP Head Office Battaramulla", "Galle Provincial Office"],
    },
  },
  {
    id: "passport-renewal",
    name: "Passport Renewal",
    category: "Identity Documents",
    description: "Renew existing Sri Lankan passport",
    fee: "Rs. 3,500 (32 pages) / Rs. 7,000 (64 pages)",
    processingTime: "7-10 working days",
    location: ["Department of Immigration and Emigration offices"],
    documents: [
      {
        name: "Application Form",
        required: true,
        description: "Duly filled passport application form",
      },
      {
        name: "Current Passport",
        required: true,
        description: "Original current passport with photocopies of bio-data, observation, and alteration pages",
      },
      {
        name: "Photographs",
        required: true,
        description: "Recent colored photographs meeting specific size and background requirements",
      },
      {
        name: "Birth Certificate",
        required: true,
        description: "Original birth certificate with photocopy",
      },
      {
        name: "National Identity Card",
        required: true,
        description: "Original NIC with photocopy",
      },
      {
        name: "Marriage Certificate",
        required: false,
        description: "Original with photocopy (if applicable for name change after marriage)",
      },
      {
        name: "Professional Certificates",
        required: false,
        description: "Educational/professional certificates or employer letter for profession inclusion",
      },
    ],
    additionalInfo: [
      "For dual citizens: Submit Dual Citizenship Certificate and copy of foreign passport",
      "For minors: Additional consent from both parents and parents' documents required",
      "Applicants born outside Sri Lanka over 21: May need affidavit affirming Sri Lankan citizenship",
    ],
  },
  {
    id: "passport-new",
    name: "New Passport Application",
    category: "Identity Documents",
    description: "Apply for first-time Sri Lankan passport",
    fee: "Rs. 3,500 (32 pages) / Rs. 7,000 (64 pages)",
    processingTime: "10-14 working days",
    location: ["Department of Immigration and Emigration offices"],
    documents: [
      {
        name: "Application Form",
        required: true,
        description: "Duly filled passport application form",
      },
      {
        name: "Birth Certificate",
        required: true,
        description: "Original birth certificate with photocopy",
      },
      {
        name: "National Identity Card",
        required: true,
        description: "Original NIC with photocopy",
      },
      {
        name: "Photographs",
        required: true,
        description: "Recent colored photographs meeting specific requirements",
      },
      {
        name: "Marriage Certificate",
        required: false,
        description: "If applicable for married applicants",
      },
    ],
    additionalInfo: [
      "First-time applicants may need additional verification",
      "Processing time may be longer for first-time applications",
    ],
  },
  {
    id: "birth-certificate-local",
    name: "Birth Certificate (Local Registration)",
    category: "Civil Registration",
    description: "Register birth and obtain certificate for births in Sri Lanka",
    fee: "Rs. 500",
    processingTime: "Same day to 3 working days",
    location: ["Divisional Secretariat offices", "District Registrar offices"],
    documents: [
      {
        name: "Hospital Birth Report",
        required: true,
        description: "Original birth report from hospital or medical institution",
      },
      {
        name: "Parents' Identity Documents",
        required: true,
        description: "Original NICs or passports of both parents with photocopies",
      },
      {
        name: "Parents' Marriage Certificate",
        required: true,
        description: "Original marriage certificate of parents with photocopy",
      },
      {
        name: "Application Form",
        required: true,
        description: "Completed birth registration form",
      },
    ],
    additionalInfo: [
      "Registration must be done within 42 days of birth for free service",
      "Late registration (after 42 days) incurs additional fees",
      "Both parents should be present or provide consent",
    ],
  },
  {
    id: "birth-certificate-overseas",
    name: "Birth Certificate (Overseas Registration)",
    category: "Civil Registration",
    description: "Register overseas birth for children of Sri Lankan parents",
    fee: "Varies by embassy/consulate",
    processingTime: "2-4 weeks",
    location: ["Sri Lankan embassies/consulates", "Department of Immigration and Emigration"],
    documents: [
      {
        name: "Registration Forms",
        required: true,
        description: "Form B4 (within 3 months) or B6 (after 3 months), Citizenship Application and Declaration Forms",
      },
      {
        name: "Overseas Birth Certificate",
        required: true,
        description: "Child's birth certificate from country of birth with English translation if needed",
      },
      {
        name: "Consular Birth Certificate",
        required: true,
        description: "Issued by Registrar General's Department of Sri Lanka",
      },
      {
        name: "Parents' Birth Certificates",
        required: true,
        description: "Original birth certificates of both parents (certificates before 2008 may not be accepted)",
      },
      {
        name: "Parents' Marriage Certificate",
        required: true,
        description: "Original marriage certificate (English translations not accepted)",
      },
      {
        name: "Travel Documents",
        required: true,
        description:
          "Parents' passport bio-data and visa pages from time of birth, travel documents proving residence abroad",
      },
    ],
    additionalInfo: [
      "For late registration: Letter of explanation to Registrar General required",
      "Dual citizenship certificates needed if parents hold dual citizenship",
      "All documents must be originals - translations not accepted in lieu of originals",
    ],
  },
  {
    id: "driving-license-renewal",
    name: "Driving License Renewal",
    category: "Transport Documents",
    description: "Renew existing Sri Lankan driving license",
    fee: "Rs. 2,850 (5 years) / Rs. 5,700 (10 years)",
    processingTime: "Same day",
    location: ["Department of Motor Traffic offices"],
    documents: [
      {
        name: "National Identity Card",
        required: true,
        description: "Original NIC or passport with photocopy",
      },
      {
        name: "Existing License",
        required: true,
        description: "Current driving license (or police report if lost/damaged)",
      },
      {
        name: "Medical Certificate",
        required: true,
        description:
          "Medical Fitness Certificate from Sri Lanka National Transport Medical Institute (within 6 months)",
      },
      {
        name: "Application Form",
        required: true,
        description: "Completed application form from DMT or official website",
      },
    ],
    additionalInfo: [
      "Medical certificate must be obtained within 6 months",
      "Renewal can be done up to 6 months before expiry",
      "Late renewal may incur additional penalties",
    ],
  },
  {
    id: "driving-license-new",
    name: "New Driving License Application",
    category: "Transport Documents",
    description: "Apply for first-time driving license",
    fee: "Rs. 2,850 (5 years) / Rs. 5,700 (10 years)",
    processingTime: "After passing driving test",
    location: ["Department of Motor Traffic offices"],
    documents: [
      {
        name: "National Identity Card",
        required: true,
        description: "Original NIC with photocopy",
      },
      {
        name: "Medical Certificate",
        required: true,
        description: "Medical Fitness Certificate from authorized medical center",
      },
      {
        name: "Application Form",
        required: true,
        description: "Completed application form",
      },
      {
        name: "Learner's Permit",
        required: true,
        description: "Valid learner's permit",
      },
      {
        name: "Driving Test Certificate",
        required: true,
        description: "Certificate of passing practical driving test",
      },
    ],
    additionalInfo: [
      "Must hold learner's permit for minimum period before test",
      "Practical and theory tests required",
      "Age requirements vary by vehicle category",
    ],
  },
  {
    id: "business-registration",
    name: "Business Registration (Private Limited Company)",
    category: "Business Documents",
    description: "Incorporate a private limited company in Sri Lanka",
    fee: "Rs. 2,500 - Rs. 10,000 (depending on capital)",
    processingTime: "1-3 working days (online)",
    location: ["Online via eROC system", "Registrar of Companies office"],
    documents: [
      {
        name: "Company Name Approval",
        required: true,
        description: "Verified and approved company name from Department of Registrar of Companies",
      },
      {
        name: "Articles of Association",
        required: true,
        description: "AoA outlining company objectives and operational instructions",
      },
      {
        name: "Form 1",
        required: true,
        description: "Business registration application form",
      },
      {
        name: "Form 18",
        required: true,
        description: "Consent and Certificate of Director",
      },
      {
        name: "Form 19",
        required: true,
        description: "Consent and Certificate of Secretary/Secretaries",
      },
      {
        name: "Identity Documents",
        required: true,
        description: "Passport copies, photo ID, utility bills, and specimen signatures of all officeholders",
      },
      {
        name: "Registered Office Address",
        required: true,
        description: "Proof of registered office address",
      },
    ],
    additionalInfo: [
      "Minimum 1 director and 1 shareholder required (can be same person)",
      "Resident company secretary must be appointed",
      "No minimum capital requirement",
      "100% foreign ownership allowed in most sectors",
      "TIN certificate required after registration",
    ],
  },
]

// Helper functions to search and filter services
export function getServiceById(id: string): ServiceRequirement | undefined {
  return GOVERNMENT_SERVICES.find((service) => service.id === id)
}

export function getServicesByCategory(category: string): ServiceRequirement[] {
  return GOVERNMENT_SERVICES.filter((service) => service.category === category)
}

export function searchServices(query: string): ServiceRequirement[] {
  const lowercaseQuery = query.toLowerCase()
  return GOVERNMENT_SERVICES.filter(
    (service) =>
      service.name.toLowerCase().includes(lowercaseQuery) ||
      service.description.toLowerCase().includes(lowercaseQuery) ||
      service.category.toLowerCase().includes(lowercaseQuery),
  )
}

export function getDocumentsByService(serviceId: string): DocumentRequirement[] {
  const service = getServiceById(serviceId)
  return service ? service.documents : []
}

// Common document types that appear across multiple services
export const COMMON_DOCUMENTS = {
  NIC: "National Identity Card (original with photocopy)",
  BIRTH_CERTIFICATE: "Birth Certificate (original with photocopy)",
  PASSPORT: "Passport (original with photocopy)",
  MARRIAGE_CERTIFICATE: "Marriage Certificate (original with photocopy)",
  PHOTOGRAPH: "Recent passport-size photographs",
  POLICE_REPORT: "Police report for lost documents",
  MEDICAL_CERTIFICATE: "Medical fitness certificate",
  APPLICATION_FORM: "Completed application form",
}
