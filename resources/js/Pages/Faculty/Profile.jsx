import React, { useState } from 'react';
import { usePage, useForm, Head } from '@inertiajs/react';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import FacultyLayout from '@/Layouts/FacultyLayout';

export default function Profile() {
    const { user, dependents } = usePage().props;
    const [activeTab, setActiveTab] = useState('basic');
    const [showAddDependent, setShowAddDependent] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, patch, delete: destroy, reset, errors } = useForm({
        name: '',
        relationship: '',
        date_of_birth: '',
        contact_number: '',
        email: '',
        address: '',
        aadhar_number: '',
    });

    const handleAddDependent = () => {
        setShowAddDependent(true);
        reset();
        setEditingId(null);
    };

    const handleEditDependent = (dependent) => {
        setEditingId(dependent.id);
        setShowAddDependent(true);
        setData({
            name: dependent.name,
            relationship: dependent.relationship,
            date_of_birth: dependent.date_of_birth,
            contact_number: dependent.contact_number || '',
            email: dependent.email || '',
            address: dependent.address || '',
            aadhar_number: dependent.aadhar_number || '',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            patch(route('faculty.dependents.update', editingId), {
                onSuccess: () => {
                    reset();
                    setShowAddDependent(false);
                    setEditingId(null);
                },
            });
        } else {
            post(route('faculty.dependents.store'), {
                onSuccess: () => {
                    reset();
                    setShowAddDependent(false);
                },
            });
        }
    };

    const handleDeleteDependent = (id) => {
        if (confirm('Are you sure you want to remove this dependent?')) {
            destroy(route('faculty.dependents.destroy', id));
        }
    };

    const relationshipOptions = [
        { value: 'spouse', label: 'Spouse' },
        { value: 'son', label: 'Son' },
        { value: 'daughter', label: 'Daughter' },
        { value: 'father', label: 'Father' },
        { value: 'mother', label: 'Mother' },
        { value: 'brother', label: 'Brother' },
        { value: 'sister', label: 'Sister' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <FacultyLayout>
            <Head title="Faculty Profile" />

            <div className="font-sans text-slate-900">
            <header className="bg-white border border-slate-200 rounded-lg shadow-sm px-6 py-5 mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Faculty Profile</h1>
                <p className="text-slate-600 text-sm mt-1">Manage your information and dependents</p>
            </header>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-slate-200 bg-slate-50">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('basic')}
                            className={`flex-1 px-6 py-4 font-semibold text-sm transition-colors ${
                                activeTab === 'basic'
                                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                    : 'text-slate-700 hover:text-slate-900'
                            }`}
                        >
                            Basic Information
                        </button>
                        <button
                            onClick={() => setActiveTab('dependents')}
                            className={`flex-1 px-6 py-4 font-semibold text-sm transition-colors border-l border-slate-200 ${
                                activeTab === 'dependents'
                                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                    : 'text-slate-700 hover:text-slate-900'
                            }`}
                        >
                            Dependents
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Basic Information Tab */}
                    {activeTab === 'basic' && user.faculty && (
                        <div className="space-y-6">
                            {/* Personal Details */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-200">
                                    Personal Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InfoField label="Full Name" value={user.name} />
                                    <InfoField label="Email" value={user.email} />
                                    <InfoField label="Date of Birth" value={user.faculty.date_of_birth ? new Date(user.faculty.date_of_birth).toLocaleDateString() : '-'} />
                                    <InfoField label="Gender" value={user.faculty.gender} />
                                    <InfoField label="Marital Status" value={user.faculty.marital_status} />
                                    <InfoField label="Religion" value={user.faculty.religion} />
                                    <InfoField label="Category" value={user.faculty.category} />
                                    <InfoField label="Nationality" value={user.faculty.nationality} />
                                    <InfoField label="Blood Group" value={user.faculty.blood_group} />
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-200">
                                    Professional Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InfoField label="Employee ID" value={user.faculty.employee_id} />
                                    <InfoField label="Department" value={user.faculty.department} />
                                    <InfoField label="Present Designation" value={user.faculty.present_designation} />
                                    <InfoField label="Designation at Joining" value={user.faculty.designation_at_joining} />
                                    <InfoField label="Date of Joining" value={user.faculty.doj ? new Date(user.faculty.doj).toLocaleDateString() : '-'} />
                                    <InfoField label="Confirmation Date" value={user.faculty.confirmation_date ? new Date(user.faculty.confirmation_date).toLocaleDateString() : '-'} />
                                    <InfoField label="Present Tenure DOJ" value={user.faculty.present_tenure_doj ? new Date(user.faculty.present_tenure_doj).toLocaleDateString() : '-'} />
                                    <InfoField label="PTN" value={user.faculty.ptn} />
                                    <InfoField label="IDN" value={user.faculty.idn} />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-200">
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InfoField label="Official Email" value={user.faculty.official_email} />
                                    <InfoField label="Contact Number" value={user.faculty.contact_number} />
                                    <InfoField label="Emergency Contact" value={user.faculty.emergency_contact_number} />
                                </div>
                                <div className="grid grid-cols-1 gap-4 mt-4">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Current Address</p>
                                        <p className="text-slate-900 text-sm leading-relaxed">{user.faculty.current_address || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Permanent Address</p>
                                        <p className="text-slate-900 text-sm leading-relaxed">{user.faculty.permanent_address || '-'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Document Information */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-200">
                                    Document Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InfoField label="PAN Number" value={user.faculty.pan_number} />
                                    <InfoField label="Aadhar Number" value={user.faculty.aadhar_number ? `****${user.faculty.aadhar_number.slice(-4)}` : '-'} />
                                    <InfoField label="Passport Number" value={user.faculty.passport_number} />
                                    <InfoField label="PRAN Number" value={user.faculty.pran_number} />
                                </div>
                            </div>

                            {/* Financial Information */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-200">
                                    Financial Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InfoField label="Bank Name" value={user.faculty.bank_name} />
                                    <InfoField label="Bank Branch" value={user.faculty.bank_branch} />
                                    <InfoField label="IFSC Code" value={user.faculty.ifsc_code} />
                                    <InfoField label="Salary Account" value={user.faculty.salary_account_number} />
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-200">
                                    Academic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InfoField label="PhD Date" value={user.faculty.phd_date ? new Date(user.faculty.phd_date).toLocaleDateString() : '-'} />
                                    <InfoField label="PhD University" value={user.faculty.phd_university} />
                                    <InfoField label="Contract End Date" value={user.faculty.contract_end_date ? new Date(user.faculty.contract_end_date).toLocaleDateString() : '-'} />
                                    <InfoField label="Retirement Date" value={user.faculty.retirement_date ? new Date(user.faculty.retirement_date).toLocaleDateString() : '-'} />
                                    <InfoField label="Relocation Claim" value={user.faculty.relocation_claim ? 'Yes' : 'No'} />
                                    <InfoField label="Status" value={user.faculty.is_active ? 'Active' : 'Inactive'} />
                                    <InfoField label="Remarks" value={user.faculty.remarks} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dependents Tab */}
                    {activeTab === 'dependents' && (
                        <div className="space-y-4">
                            {/* Add Form */}
                            {showAddDependent && (
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            {editingId ? 'Edit Dependent' : 'Add New Dependent'}
                                        </h3>
                                        <button
                                            onClick={() => {
                                                setShowAddDependent(false);
                                                reset();
                                                setEditingId(null);
                                            }}
                                            className="text-slate-500 hover:text-slate-700"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                                    Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                    required
                                                />
                                                {errors.name && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                                    Relationship *
                                                </label>
                                                <select
                                                    value={data.relationship}
                                                    onChange={(e) => setData('relationship', e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    {relationshipOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.relationship && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.relationship}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                                    Date of Birth
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.date_of_birth}
                                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                />
                                                {errors.date_of_birth && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.date_of_birth}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                                    Contact Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={data.contact_number}
                                                    onChange={(e) => setData('contact_number', e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                />
                                                {errors.contact_number && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.contact_number}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                />
                                                {errors.email && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                                    Aadhar Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.aadhar_number}
                                                    onChange={(e) => setData('aadhar_number', e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                />
                                                {errors.aadhar_number && (
                                                    <p className="text-red-600 text-xs mt-1">{errors.aadhar_number}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                                Address
                                            </label>
                                            <textarea
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                rows="2"
                                            />
                                            {errors.address && (
                                                <p className="text-red-600 text-xs mt-1">{errors.address}</p>
                                            )}
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="submit"
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                            >
                                                {editingId ? 'Update' : 'Add'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowAddDependent(false);
                                                    reset();
                                                    setEditingId(null);
                                                }}
                                                className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Add Button */}
                            {!showAddDependent && (
                                <button
                                    onClick={handleAddDependent}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Dependent
                                </button>
                            )}

                            {/* Dependents Table */}
                            {dependents && dependents.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Relationship</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">DOB</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Contact</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Email</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dependents.map((dependent, idx) => (
                                                <tr key={dependent.id} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50`}>
                                                    <td className="px-4 py-3 text-slate-900 font-medium">{dependent.name}</td>
                                                    <td className="px-4 py-3 text-slate-700 capitalize">{dependent.relationship}</td>
                                                    <td className="px-4 py-3 text-slate-700">{dependent.date_of_birth ? new Date(dependent.date_of_birth).toLocaleDateString() : '-'}</td>
                                                    <td className="px-4 py-3 text-slate-700">{dependent.contact_number || '-'}</td>
                                                    <td className="px-4 py-3 text-slate-700 text-xs">{dependent.email || '-'}</td>
                                                    <td className="px-4 py-3 space-x-2 flex">
                                                        <button
                                                            onClick={() => handleEditDependent(dependent)}
                                                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteDependent(dependent.id)}
                                                            className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <p className="text-sm">No dependents recorded</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            </div>
        </FacultyLayout>
    );
}

function InfoField({ label, value }) {
    return (
        <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">
                {label}
            </p>
            <p className="text-slate-900 text-sm leading-6">
                {value || <span className="text-slate-400">-</span>}
            </p>
        </div>
    );
}
