export interface ClaimSample { id: string; title: string; pet: string; category: string; text: string }
// Entirely invented demonstration narratives, attachments and policy evidence.
// Do not paste real claimant data into a publicly hosted demonstration.
export const CLAIMS: ClaimSample[] = [
  {
    id: 'string', title: 'Cat swallowed string', pet: 'Miso · cat', category: 'Emergency',
    text: 'SYNTHETIC CLAIM — Miso, a 3-year-old indoor cat, swallowed sewing thread this morning. He is vomiting and the emergency vet suspects a linear foreign body. Surgery is being arranged; estimate $2,850. Attachments: examination notes, radiographs, dated itemized estimate and owner details. Synthetic policy evidence: accident cover began 14 months ago and the waiting period has passed. Treatment is ongoing; the final invoice is not yet available. No prior gastrointestinal history is reported. This invented policy summary is not a coverage assurance.',
  },
  {
    id: 'cruciate', title: 'Cruciate ligament tear', pet: 'Oakley · dog', category: 'Surgery',
    text: 'SYNTHETIC CLAIM — Oakley, a 6-year-old Labrador, became lame after turning sharply while playing. The orthopedic vet diagnosed a cranial cruciate ligament tear and recommends TPLO surgery next week; estimate $4,600. Attachments: orthopedic notes, imaging, itemized estimate and clinical history. Synthetic policy evidence: orthopedic cover is listed, but onset and the bilateral-condition clause still need verification. Oakley is stable on prescribed medication. There is no stated invoice discrepancy. This invented evidence does not determine eligibility.',
  },
  {
    id: 'chocolate', title: 'Chocolate ingestion', pet: 'Pepper · dog', category: 'Emergency',
    text: 'SYNTHETIC CLAIM — Pepper, a 9 kg terrier, ate approximately 120 g of dark chocolate 45 minutes ago. The emergency clinic reports rapid heart rate and tremors and has admitted her for urgent treatment; estimate $1,420. Attachments: admission notes, weight, ingestion timeline and itemized estimate. Synthetic policy evidence: accidental poisoning is listed after the waiting period, with no prior related condition. A final invoice will follow after discharge. Owner asks for rapid contact, not medical instructions. No insurer has verified this invented summary.',
  },
  {
    id: 'dental', title: 'Routine dental treatment', pet: 'Cleo · cat', category: 'Routine dental',
    text: 'SYNTHETIC CLAIM — Cleo, a 5-year-old cat, had a scheduled dental cleaning and treatment for mild gingivitis on 8 October. She is eating normally and was discharged the same afternoon. Total paid: $380. Attachments: dated itemized paid invoice, dental examination notes, treatment record, owner and pet details. Synthetic policy evidence: the invented dental-care add-on explicitly lists this treatment, was active before the event, and its waiting period has passed; there is no prior-condition dispute. No conflicting invoice or cancellation intent is reported. All documents and policy statements are invented for demonstration, not insurer assurance.',
  },
  {
    id: 'foreign-body', title: 'Sock foreign body', pet: 'Bruno · dog', category: 'Hospitalization',
    text: 'SYNTHETIC CLAIM — Bruno, a 2-year-old spaniel, swallowed a sock and developed repeated vomiting yesterday. Ultrasound found an obstruction. The vet removed the sock surgically and Bruno remains hospitalized overnight. Invoice to date: $2,970. Attachments: surgical notes, imaging, dated itemized invoice and owner details. Synthetic policy evidence: accident benefits are listed with no waiting-period issue or prior obstruction, but the discharge record is pending. There is no discrepancy in the supplied dates. This invented policy evidence is not an insurer determination.',
  },
  {
    id: 'wellness', title: 'Annual wellness visit', pet: 'Luna · dog', category: 'Preventive care',
    text: 'SYNTHETIC CLAIM — Luna, a healthy 4-year-old mixed-breed dog, attended her annual wellness visit with vaccination and flea prevention. Total paid: $146. No illness or injury was found. Attachments: dated itemized paid invoice, examination record, vaccine record and owner details. Synthetic policy evidence: the invented wellness add-on lists these preventive services, is active and has remaining illustrative allowance. No waiting-period, prior-condition, invoice conflict or cancellation intent is reported. This fictional allowance is not confirmation of real coverage.',
  },
  {
    id: 'preexisting', title: 'Pre-existing condition dispute', pet: 'Teddy · dog', category: 'Specialist review',
    text: 'SYNTHETIC CLAIM — Teddy, an 8-year-old pug, received treatment for recurrent skin disease costing $620. The owner disputes a previous pre-existing-condition assessment and says earlier itching was unrelated. Notes from before the invented policy start describe similar symptoms. Attachments: itemized paid invoice, recent clinical notes, earlier records and the owner appeal. Synthetic policy evidence: the prior-condition exclusion is disputed and onset is unresolved. Teddy is stable. The owner asks for a specialist to review the evidence. This fictional dispute must not be resolved automatically.',
  },
  {
    id: 'missing-invoice', title: 'Missing treatment invoice', pet: 'Poppy · rabbit', category: 'Incomplete evidence',
    text: 'SYNTHETIC CLAIM — Poppy, a 3-year-old rabbit, was treated for a mild eye infection and is recovering at home. The owner reports paying approximately $210 but has not obtained the itemized invoice. Attachments: a brief clinic note and a photograph of Poppy; event date and receipt are missing. Synthetic policy evidence: an illness section is mentioned but no policy schedule is supplied. No invoice inconsistency can be assessed without the invoice. The owner requests help collecting documents. Nothing in this invented narrative establishes entitlement.',
  },
  {
    id: 'duplicate-invoice', title: 'Potential duplicate invoice', pet: 'Alfie · dog', category: 'Integrity review',
    text: 'SYNTHETIC CLAIM — Alfie, a 4-year-old beagle, was treated for a minor paw cut; invoice $275. Two submissions list the same clinic invoice number PAW-204, same service date and same total, but different reimbursement account endings. Attachments: both invoice copies, treatment notes, event dates and owner details. Synthetic policy evidence: minor accident care is listed with no waiting-period dispute. Alfie is well. The duplicate may be a clerical error; it is only a signal for human integrity review, never a finding of fraud or grounds for automated denial.',
  },
  {
    id: 'liability', title: 'Uncertain policy eligibility', pet: 'Nala · cat', category: 'Policy review',
    text: 'SYNTHETIC CLAIM — Nala, a 7-year-old cat, was assessed for increased thirst and early kidney disease. Total paid: $540. Attachments: itemized paid invoice, laboratory results, visit notes and owner details. The reported symptom onset is close to the invented policy activation date. Synthetic policy evidence: the schedule gives two conflicting waiting-period dates and does not clarify which applies. The owner is unsure when symptoms first began. Nala is stable and follow-up is booked. Eligibility requires human verification; this invented record cannot establish real insurer liability.',
  },
  {
    id: 'cancellation', title: 'Cancellation risk after delays', pet: 'Ruby · dog', category: 'Service escalation',
    text: 'SYNTHETIC CLAIM — Ruby, a 5-year-old golden retriever, completed outpatient treatment for a mild skin infection. Paid invoice: $325. Attachments: itemized invoice, complete visit notes, event dates and owner details. Synthetic policy evidence: this new illness is explicitly listed after the waiting period, with no conflicting prior history. The owner has followed up four times over three weeks and writes, "If I do not hear from a person today, I will cancel at renewal." No invoice inconsistency is reported. The cancellation statement calls for human service attention, not a different eligibility decision.',
  },
  {
    id: 'ear-infection', title: 'Straightforward ear infection', pet: 'Finn · dog', category: 'Outpatient illness',
    text: 'SYNTHETIC CLAIM — Finn, a 2-year-old cockapoo, developed a first episode of mild otitis after swimming. The vet examined him on 7 October, prescribed ear drops and discharged him home. Total paid: $185. Attachments: dated itemized paid invoice, examination and treatment notes, symptom-onset date, owner and pet details. Synthetic policy evidence: the invented illness policy was active six months before symptoms, its waiting period has passed, and first-episode otitis is explicitly listed with no relevant prior-condition exclusion. No discrepancy, dispute or cancellation intent is reported. All policy evidence is invented, not insurer assurance.',
  },
];
