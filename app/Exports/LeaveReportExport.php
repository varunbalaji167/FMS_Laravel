<?php

namespace App\Exports;

use App\Models\Leave;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LeaveReportExport implements FromCollection, WithHeadings, WithStyles
{
    private $leaves;

    public function __construct($leaves)
    {
        $this->leaves = $leaves;
    }

    public function collection()
    {
        return $this->leaves->map(function ($leave) {
            return [
                'Faculty Name' => $leave->user->name,
                'Email' => $leave->user->email,
                'Leave Type' => Leave::LEAVE_TYPES[$leave->leave_type]['name'] ?? $leave->leave_type,
                'Start Date' => $leave->start_date->format('Y-m-d'),
                'End Date' => $leave->end_date->format('Y-m-d'),
                'Total Days' => $leave->total_days,
                'Reason' => $leave->reason,
                'HOD Status' => ucfirst($leave->recommender_status),
                'Admin Status' => ucfirst($leave->approver_status),
                'Applied Date' => $leave->created_at->format('Y-m-d H:i'),
                'Approved Date' => $leave->approver_approved_at?->format('Y-m-d H:i') ?? '-',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Faculty Name',
            'Email',
            'Leave Type',
            'Start Date',
            'End Date',
            'Total Days',
            'Reason',
            'HOD Status',
            'Admin Status',
            'Applied Date',
            'Approved Date',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the header row
            1 => [
                'font' => ['bold' => true, 'size' => 12],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '4472C4']],
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'alignment' => ['horizontal' => 'center'],
            ],
        ];
    }
}
