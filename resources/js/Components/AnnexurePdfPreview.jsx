import React from 'react';

function formatDate(value) {
    if (!value) return '....................';
    try {
        return new Date(value).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return value;
    }
}

function formatMonthYear(value) {
    if (!value) return '....................';
    try {
        return new Date(value).toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
        }).toUpperCase();
    } catch {
        return value;
    }
}

function get(formData, key, fallback = '....................') {
    const val = formData?.[key];
    if (val === undefined || val === null || val === '') return fallback;
    return String(val);
}

function Section({ children }) {
    return <div className="bg-white border border-gray-300 shadow-sm p-8 md:p-10 text-[15px] leading-relaxed">{children}</div>;
}

function AnnexureAPassportTemplate({ formData }) {
    return (
        <Section>
            <div className="text-center font-bold text-[18px] mb-1">ANNEXURE ‘A’</div>
            <div className="text-center text-sm mb-8">-</div>

            <div className="text-[15px] leading-7 space-y-4">
                <p>
                    Certified that <b>{get(formData, 'faculty_name')}</b>, son of <b>{get(formData, 'father_name')}</b>, who is an Indian national,
                    is employed at the Indian Institute of Technology (IIT) Indore, Madhya Pradesh, India, since <b>{formatDate(get(formData, 'doj'))}</b>, as an <b>{get(formData, 'designation')}</b>
                    in the Department of <b>{get(formData, 'department')}</b> and presently, he is working as a Professor since October 27, 2023.
                </p>

                <p>
                    <b>{get(formData, 'dependent_name', 'Dependent Name')}</b>, who is also an Indian national, is a <b>{get(formData, 'dependent_relation', 'spouse')}</b> and dependent family member of
                    faculty <b>{get(formData, 'faculty_name')}</b>. His/Her identity is certified. This organization has no objection to issue an Indian Passport to him/her.
                </p>

                <p>
                    I, the undersigned, am duly authorized to sign this Identity Certificate. I have read the provisions of Section 6(2) of the Passports Act, 1967 and certify that these are not attracted
                    in case of this applicant. I recommend issue of an Indian Passport to <b>{get(formData, 'dependent_name', 'the applicant')}</b>. It is certified that this organization is a Central Government Autonomous body working under
                    Ministry of Education, Government of India.
                </p>

                <p>
                    The Identity Card Number of <b>{get(formData, 'faculty_name')}</b> is <b>{get(formData, 'idn')}</b>.
                </p>
            </div>

            <div className="mt-16 flex items-end justify-between gap-8">
                <div className="w-20 h-24 border border-gray-700 flex items-center justify-center text-[10px] leading-tight text-center px-2">
                    Applicant's photo to be attested by certifying authority
                </div>

                <div className="text-right max-w-[320px] text-[14px] leading-6">
                    <div className="font-bold">Rajan Thomas</div>
                    <div>Assistant Registrar, Faculty Affairs</div>
                    <div>Indian Institute of Technology Indore</div>
                    <div>Simrol, Khandwa Road, Indore-453552</div>
                    <div>Madhya Pradesh, India</div>
                    <div>Office: 0731-660-3509 (Ext. No. 3509)</div>
                    <div>Email-id: arfacultyaffairs@iiti.ac.in</div>
                </div>
            </div>

            <div className="mt-10 flex justify-between items-start text-[13px] font-semibold">
                <div>
                    <div>REF. NO.: IIT/FA/PT/40/{new Date().getFullYear()}/</div>
                    <div>{formatDate(new Date())}</div>
                </div>
                <div>{formatMonthYear(new Date())}</div>
            </div>
        </Section>
    );
}

function AddressProofTemplate({ formData }) {
    return (
        <Section>
            <div className="text-center mb-5">
                <div className="font-bold underline text-xl">संकाय कार्य कार्यालय (OFFICE OF FACULTY AFFAIRS)</div>
            </div>

            <div className="flex justify-between mb-4">
                <span>IITI/FA/PT/113/2024/</span>
                <span>{formatDate(new Date())}</span>
            </div>

            <div className="text-center font-bold underline text-2xl mb-6">To whom it may Concern</div>

            <ol className="list-decimal pl-6 space-y-5 text-[15px]">
                <li>
                    <div>यह प्रमाणित किया जाता है कि <b>{get(formData, 'faculty_name')}</b> भारतीय प्रौद्योगिकी संस्थान इंदौर के <b>{get(formData, 'department')}</b> विभाग में सहायक प्रोफेसर के पद पर कार्यरत हुए थे।</div>
                    <div>
                        This is to certify that <b>{get(formData, 'faculty_name')}</b> joined Indian Institute of Technology Indore on <b>{get(formData, 'doj')}</b> and is working as <b>{get(formData, 'designation')}</b> in Department of <b>{get(formData, 'department')}</b>.
                    </div>
                </li>

                <li>
                    <div>यह भी प्रमाणित किया जाता है कि आश्रित का नाम <b>{get(formData, 'dependent_name', 'XXXX')}</b> है।</div>
                    <div>
                        It is also certified that dependent name is <b>{get(formData, 'dependent_name', 'XXXX')}</b> of faculty member <b>{get(formData, 'faculty_name')}</b>.
                    </div>
                </li>

                <li>
                    <div>संस्थान में दर्ज जानकारी के अनुसार उनका आवासीय पता निम्नलिखित है:</div>
                    <div>His residential address as per the institute records is as appended below:</div>

                    <div className="mt-3 grid grid-cols-[1fr_130px] gap-4 items-stretch">
                        <table className="w-full border border-gray-700 text-sm">
                            <tbody>
                                <tr>
                                    <td className="border-r border-gray-700 p-2 w-1/2">Address in Hindi</td>
                                    <td className="p-2">Address in English</td>
                                </tr>
                                <tr>
                                    <td className="border-r border-t border-gray-700 p-2 align-top min-h-[90px]">
                                        {get(formData, 'address')}
                                    </td>
                                    <td className="border-t border-gray-700 p-2 align-top min-h-[90px]">
                                        {get(formData, 'address_english')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="border border-gray-700 h-full min-h-[120px]" />
                    </div>
                </li>

                <li>
                    <div>यह प्रमाणपत्र <b>{get(formData, 'reason', 'आधिकारिक प्रयोजन')}</b> हेतु जारी किया जाता है।</div>
                    <div>
                        This certificate is issued for the purpose of <b>{get(formData, 'reason', 'official use')}</b>.
                    </div>
                </li>

                <li>
                    <div>
                        यह पता प्रमाण पत्र अंग्रेजी और हिंदी भाषाओं में प्रकाशित किया गया है। व्याख्या में किसी प्रकार की विसंगति की स्थिति में अंग्रेजी संस्करण मान्य होगा।
                    </div>
                    <div>
                        This Address Proof Certificate is published in English and Hindi languages. In case of discrepancy in interpretation, English version shall prevail.
                    </div>
                </li>
            </ol>

            <div className="mt-16 grid grid-cols-2 gap-8">
                <div>
                    <div className="font-semibold">प्रति/To,</div>
                    <div className="mt-2">{get(formData, 'faculty_name')}</div>
                    <div>{get(formData, 'designation')}</div>
                    <div>{get(formData, 'department')}</div>
                    <div>Indian Institute of Technology Indore</div>
                </div>

                <div className="text-right">
                    <div className="font-bold">सहायक कुलसचिव, संकाय कार्य कार्यालय</div>
                    <div className="font-bold">Assistant Registrar, Faculty Affairs</div>
                </div>
            </div>
        </Section>
    );
}

function NocVisaTemplate({ formData }) {
    return (
        <Section>
            <div className="text-center font-bold underline text-2xl mb-6">OFFICE OF FACULTY AFFAIRS</div>
            <div className="flex justify-between mb-8">
                <span>IITI/FA/PT/34/2026/</span>
                <span>{formatDate(new Date())}</span>
            </div>

            <div className="text-center font-bold underline mb-8 text-xl">NO OBJECTION CERTIFICATE: VISITORS INTERNATIONAL STAY ADMISSION (VISA)</div>

            <ol className="list-decimal pl-6 space-y-5">
                <li>
                    <b>{get(formData, 'faculty_name', get(formData, 'employee_name'))}</b> joined Indian Institute of Technology Indore on <b>{get(formData, 'doj')}</b>,
                    and is currently working as <b>{get(formData, 'designation')}</b> in the Department of <b>{get(formData, 'department')}</b>.
                </li>
                <li>
                    The Passport No. of <b>{get(formData, 'faculty_name', get(formData, 'employee_name'))}</b> is <b>{get(formData, 'passport_number')}</b>.
                </li>
                <li>
                    The Institute has no objection to being granted a VISA to travel <b>{get(formData, 'destination_country')}</b> for
                    <b> {get(formData, 'travel_purpose')}</b> during <b>{get(formData, 'travel_dates')}</b>.
                </li>
                <li>
                    The faculty member will resume duties after return from abroad.
                </li>
                <li>
                    Travel expenses shall be covered as per institute rules.
                </li>
            </ol>

            <div className="mt-16 text-right">
                <div className="font-bold">Assistant Registrar, Faculty Affairs</div>
                <div>Indian Institute of Technology Indore</div>
                <div>Simrol, Khandwa Road, Indore-453552</div>
                <div>Madhya Pradesh, India</div>
            </div>
        </Section>
    );
}

function BonafideTemplate({ formData }) {
    return (
        <Section>
            <div className="text-center font-bold underline text-2xl mb-6">OFFICE OF FACULTY AFFAIRS</div>
            <div className="flex justify-between mb-8">
                <span>IITI/FA/PT/8/2025/</span>
                <span>{formatDate(new Date())}</span>
            </div>
            <div className="text-center font-bold underline text-xl mb-8">Bonafide Certificate</div>

            <table className="w-full border border-gray-700 mb-8 text-sm">
                <tbody>
                    <tr className="border-b border-gray-700">
                        <td className="border-r border-gray-700 p-2 w-1/3">Name of Employee</td>
                        <td className="p-2">{get(formData, 'employee_name', get(formData, 'faculty_name'))}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                        <td className="border-r border-gray-700 p-2">Present Designation</td>
                        <td className="p-2">{get(formData, 'current_designation', get(formData, 'designation'))}</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                        <td className="border-r border-gray-700 p-2">Date of Joining</td>
                        <td className="p-2">{get(formData, 'doj')}</td>
                    </tr>
                    <tr>
                        <td className="border-r border-gray-700 p-2">Department</td>
                        <td className="p-2">{get(formData, 'department')}</td>
                    </tr>
                </tbody>
            </table>

            <ol className="list-decimal pl-6 space-y-4">
                <li>
                    This certificate is issued for <b>{get(formData, 'dependent_name')}</b> ({get(formData, 'dependent_relation')}).
                </li>
                <li>
                    Purpose: <b>{get(formData, 'reason')}</b>.
                </li>
            </ol>

            <div className="mt-16 text-right">
                <div className="font-bold">Assistant Registrar, Faculty Affairs</div>
                <div>Indian Institute of Technology Indore</div>
                <div>Simrol, Khandwa Road, Indore-453552</div>
            </div>
        </Section>
    );
}

function AnnexureHTemplate({ formData }) {
    return (
        <Section>
            <div className="text-center font-bold text-2xl mb-2">ANNEXURE ‘H’</div>
            <div className="text-center font-bold text-lg mb-8">PRIOR INTIMATION LETTER FOR PASSPORT APPLICATION</div>

            <div className="mb-8 text-right">
                <div>Place: {get(formData, 'office_address')}</div>
                <div>Date: {formatDate(new Date())}</div>
            </div>

            <div className="mb-6">
                <div>Assistant Registrar, Faculty Affairs</div>
                <div>Indian Institute of Technology Indore</div>
                <div>Simrol, Khandwa Road, Indore-453552</div>
                <div>Madhya Pradesh, India</div>
            </div>

            <div className="mb-6 font-semibold">Subject: Prior Intimation for Submission of Passport Application.</div>

            <p className="mb-6">
                I hereby give prior intimation that I am applying for an <b>{get(formData, 'passport_type')}</b> passport.
                Kindly take this for information and record.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <div>
                    <div className="mb-2">Employer Signature: ....................................</div>
                    <div>Employer Office Seal: ................................</div>
                </div>
                <div>
                    <div className="mb-2">Signature: _______________________</div>
                    <div>Name: {get(formData, 'employee_name', get(formData, 'faculty_name'))}</div>
                    <div>Date of Birth: {get(formData, 'date_of_birth')}</div>
                    <div>Designation: {get(formData, 'designation')}</div>
                    <div>Name of Organization: Indian Institute of Technology Indore</div>
                    <div>Address of Present Office: {get(formData, 'office_address')}</div>
                    <div className="mt-3">Residential Address: {get(formData, 'residential_address')}</div>
                </div>
            </div>
        </Section>
    );
}

function GenericTemplate({ template, formData }) {
    return (
        <Section>
            <div className="text-center font-bold underline text-2xl mb-6">OFFICE OF FACULTY AFFAIRS</div>
            <div className="text-center font-bold text-xl mb-8">{template?.name || 'Annexure'}</div>
            <div className="space-y-2">
                {Object.entries(formData || {}).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-3 border-b py-1">
                        <div className="font-medium text-gray-700 capitalize">{key.replaceAll('_', ' ')}</div>
                        <div className="col-span-2">{String(value ?? '')}</div>
                    </div>
                ))}
            </div>
        </Section>
    );
}

export default function AnnexurePdfPreview({ template, formData }) {
    const code = template?.code;

    if (code === 'ADDRESS_PROOF') return <AddressProofTemplate formData={formData} />;
    if (code === 'NOC_VISA') return <NocVisaTemplate formData={formData} />;
    if (code === 'BONAFIDE_CERT') return <BonafideTemplate formData={formData} />;
    if (code === 'ANNEXURE_A_PASSPORT') return <AnnexureAPassportTemplate formData={formData} />;
    if (code === 'ANNEXURE_H_PASSPORT') return <AnnexureHTemplate formData={formData} />;

    return <GenericTemplate template={template} formData={formData} />;
}
