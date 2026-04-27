<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Leave Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #4472C4;
            padding-bottom: 15px;
        }
        .header h1 {
            margin: 0;
            color: #4472C4;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0;
            font-size: 12px;
            color: #666;
        }
        .info {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f0f0f0;
            border-left: 4px solid #4472C4;
        }
        .info-row {
            display: inline-block;
            margin-right: 30px;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 11px;
        }
        th {
            background-color: #4472C4;
            color: white;
            padding: 8px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #4472C4;
        }
        td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f0f0f0;
        }
        .status-approved {
            color: green;
            font-weight: bold;
        }
        .status-pending {
            color: orange;
            font-weight: bold;
        }
        .status-rejected {
            color: red;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Leave Report</h1>
        <p>Generated on {{ $generated_at }}</p>
        <p>Report Type: {{ $report_type }} | Total Records: {{ $total_records }}</p>
    </div>

    <div class="info">
        <div class="info-row"><strong>Report Generated:</strong> {{ now()->format('d/m/Y H:i') }}</div>
        <div class="info-row"><strong>Type:</strong> {{ $report_type }}</div>
        <div class="info-row"><strong>Total Leaves:</strong> {{ $total_records }}</div>
    </div>

    @if($leaves->count() > 0)
        <table>
            <thead>
                <tr>
                    <th>Faculty Name</th>
                    <th>Email</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>HOD Status</th>
                    <th>Admin Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($leaves as $leave)
                    <tr>
                        <td>{{ $leave->user->name }}</td>
                        <td>{{ $leave->user->email }}</td>
                        <td>{{ \App\Models\Leave::LEAVE_TYPES[$leave->leave_type]['name'] ?? $leave->leave_type }}</td>
                        <td>{{ $leave->start_date->format('d/m/Y') }}</td>
                        <td>{{ $leave->end_date->format('d/m/Y') }}</td>
                        <td>{{ $leave->total_days }}</td>
                        <td>{{ substr($leave->reason, 0, 20) }}{{ strlen($leave->reason) > 20 ? '...' : '' }}</td>
                        <td class="status-{{ strtolower($leave->recommender_status) }}">{{ ucfirst($leave->recommender_status) }}</td>
                        <td class="status-{{ strtolower($leave->approver_status) }}">{{ ucfirst($leave->approver_status) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div style="padding: 20px; text-align: center; color: #666;">
            <p>No leave records found.</p>
        </div>
    @endif

    <div class="footer">
        <p>This is an automatically generated report. Please contact the administration for any discrepancies.</p>
    </div>
</body>
</html>
