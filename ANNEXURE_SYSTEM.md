# Annexure System Documentation

## Overview
The Annexure System is a comprehensive, data-driven workflow for managing structured document submissions in the FMS. It supports faculty form submission, admin review/editing, approval workflows, PDF generation, and complete audit trails.

## Architecture

### Database Schema

#### 1. **annexure_templates** table
Master template definitions defining available annexure types.

**Columns:**
- `id` - Primary key
- `name` - Display name (e.g., "Academic Credentials")
- `code` - Unique code (e.g., "ACADEMIC_CRED")
- `description` - Long description
- `category` - Template category (Education, Professional, Personal, Academic, Administrative)
- `form_schema` - JSON with field definitions (sections, fields, types, validation)
- `pdf_template_path` - Path to PDF template file (for PDF generation)
- `pdf_config` - JSON with PDF generation settings
- `visibility` - Enum: faculty_only, admin_only, public
- `requires_admin_approval` - Boolean
- `is_active` - Boolean (soft filter for archive)
- `version` - Integer (increment on update)
- `created_at, updated_at, deleted_at`

**Relationships:**
- `hasMany('requests')` - All requests using this template

**Scopes:**
- `Active()` - Only active templates
- `ByCategory($category)` - Filter by category
- `VisibleToFaculty()` - Only faculty-visible templates

#### 2. **annexure_requests** table
Main request record tracking the workflow status and progress.

**Columns:**
- `id` - Primary key
- `user_id` - Faculty submitting (FK to users)
- `annexure_template_id` - Template used (FK to annexure_templates)
- `reference_number` - Unique reference (e.g., "ANX-2026-X8K9J4P2")
- `title` - Request title
- `notes` - Additional notes from faculty
- `status` - Enum: draft → submitted → under_review → revision_requested → approved → signed → rejected
- `current_version_id` - Latest PDF version (FK to annexure_versions)
- `assigned_to` - Admin assigned for review (FK to users, nullable)
- `submitted_at` - Timestamp when submitted
- `reviewed_at` - Timestamp when review started
- `approved_at` - Timestamp when approved
- `signed_at` - Timestamp when digitally signed
- `revision_count` - Number of times revision requested
- `revision_reason` - Latest revision reason
- `admin_comments` - Approval comments
- `created_at, updated_at, deleted_at`

**Relationships:**
- `belongsTo('user')` - Faculty who submitted
- `belongsTo('template')` - Template used
- `belongsTo('currentVersion')` - Latest PDF version
- `belongsTo('assignedAdmin')` - Admin assigned (User model)
- `hasMany('data')` - All form data versions
- `hasMany('versions')` - All PDF versions
- `hasMany('auditLogs')` - All audit trail entries

**Scopes:**
- `byUser($userId)` - Filter by faculty
- `byStatus($status)` - Filter by status
- `pendingReview()` - submitted or under_review status
- `assignedToAdmin($adminId)` - Filter by assigned admin

**Methods:**
- `canEdit()` - Check if in editable status (draft, revision_requested)
- `canSubmit()` - Check if can submit (draft, revision_requested)
- `canReview()` - Check if can review (submitted, under_review)
- `canApprove()` - Check if can approve (under_review)
- `canSign()` - Check if can sign (approved)
- `getLatestData()` - Get most recent form data
- `getLatestVersion()` - Get current PDF version
- `getAllVersions()` - Get all versions in descending order

#### 3. **annexure_data** table
Versioned form inputs. Each time faculty or admin edits, a new row is created.

**Columns:**
- `id` - Primary key
- `annexure_request_id` - Request this data belongs to (FK)
- `form_data` - JSON with actual form values
- `version_number` - Sequential version (1, 2, 3, ...)
- `created_by` - User who created this version (FK to users)
- `edited_by` - User who edited this version (FK to users, nullable)
- `change_summary` - Text description of what changed
- `previous_data` - JSON copy of previous form data
- `is_valid` - Boolean (has form passed validation)
- `validation_errors` - JSON array of validation errors
- `data_status` - Enum: draft → submitted → under_review → approved → finalized
- `created_at, updated_at`

**Relationships:**
- `belongsTo('request')` - The request this data belongs to
- `belongsTo('creator')` - User who created (User model)
- `belongsTo('editor')` - User who edited (User model)
- `hasMany('versions')` - PDF versions generated from this data

**Methods:**
- `markAsValid()` - Mark as valid, clear errors
- `markAsInvalid($errors)` - Mark as invalid with error list
- `getChanges()` - Return diff between previous and current
- `getValidationStatus()` - Return validation status with errors

#### 4. **annexure_versions** table
Generated PDFs with full metadata, signatures, and download tracking.

**Columns:**
- `id` - Primary key
- `annexure_request_id` - Request (FK)
- `annexure_data_id` - Data version used (FK)
- `version_number` - Sequential PDF version
- `version_type` - Enum: faculty_draft, admin_draft, approved, final_signed
- `pdf_path` - Full file path in storage
- `pdf_filename` - Just the filename
- `pdf_file_size` - Size in bytes
- `pdf_hash` - SHA256 hash of file (for integrity)
- `generated_at` - When PDF was created
- `generated_by` - User who generated (FK)
- `signed_at` - When digitally signed (nullable)
- `signed_by` - User who signed (FK, nullable)
- `digital_signature` - Base64-encoded signature
- `signature_notes` - Notes about signature
- `generation_notes` - Generation details
- `is_current` - Boolean (is this the current version?)
- `is_downloadable` - Boolean (can faculty/admin download?)
- `download_count` - Number of downloads
- `last_downloaded_at` - Timestamp of last download (nullable)
- `created_at, updated_at`

**Scopes:**
- `current()` - Current version only
- `byType($type)` - Filter by version type
- `downloadable()` - Only downloadable versions
- `signed()` - Only signed versions
- `latest()` - Ordered by version_number DESC

**Methods:**
- `markAsCurrent()` - Set as current, unmark others
- `recordDownload()` - Increment count, update timestamp
- `sign($signature, $signedBy, $notes)` - Digital signature
- `isSigned()` - Check if signed
- `getDownloadUrl()` - Get download route
- `getVersionLabel()` - Human-readable label

#### 5. **annexure_audit_logs** table
Immutable audit trail of ALL actions.

**Columns:**
- `id` - Primary key
- `annexure_request_id` - Request (FK)
- `user_id` - User who performed action (FK)
- `action` - Enum (16 types): created, draft_saved, submitted, admin_edited, revision_requested, pdf_generated, approved, signed, rejected, downloaded, commented, assigned, data_updated, validation_failed, status_changed, metadata_updated
- `description` - Human-readable description
- `old_values` - JSON of values before change (nullable)
- `new_values` - JSON of values after change (nullable)
- `changed_fields` - JSON array of field names that changed (nullable)
- `related_version_id` - Link to PDF version if applicable (nullable)
- `ip_address` - IP address of user
- `user_agent` - Browser user agent
- `metadata` - JSON for additional context (nullable)
- `action_date` - When action occurred (indexed)
- `created_at, updated_at`

**Relationships:**
- `belongsTo('request')` - The request
- `belongsTo('user')` - User who acted
- `belongsTo('version')` - Related PDF version (nullable)

**Scopes:**
- `byAction($action)` - Filter by action type
- `byUser($userId)` - Filter by user
- `recent($hours)` - Recent actions (default 24 hours)
- `timeline()` - Ordered DESC by action_date
- `withChanges()` - Only entries with old/new values

**Methods:**
- `record($requestId, $action, $description, $userId, $data)` - Static create method
- `getActionLabel()` - Human label for action
- `getChangeSummary()` - Formatted change summary
- `getTimelineLabel()` - Formatted timeline entry

### Models

All models created with proper relationships, scopes, and business logic:

1. **AnnexureTemplate** - Template definitions
2. **AnnexureRequest** - Request master record
3. **AnnexureData** - Form data versions
4. **AnnexureVersion** - PDF file versions
5. **AnnexureAuditLog** - Audit trail

### Service Layer

**AnnexureService** - Orchestrates all workflow operations:

**Methods:**
- `createRequest($templateId, $userId, $data)` - Create new request
- `saveDraft($requestId, $formData, $userId)` - Save form data as draft
- `submitForReview($requestId, $userId)` - Submit for admin review
- `assignToAdmin($requestId, $adminId)` - Assign to admin
- `adminEdit($requestId, $formData, $adminId)` - Admin edits form
- `requestRevision($requestId, $reason, $adminId)` - Request revision from faculty
- `approve($requestId, $comments, $adminId)` - Approve request
- `sign($requestId, $signature, $adminId, $notes)` - Sign and finalize
- `reject($requestId, $reason, $adminId)` - Reject request
- `generatePdf($request, $data, $versionType, $userId)` - Generate PDF

**Key Features:**
- Automatic audit logging for all actions
- Form data validation before submission
- Comprehensive change tracking
- PDF generation triggers at key workflow points
- Error handling with audit trail of failures

### Controllers

#### **AnnexureController** (Faculty)
Routes: `/faculty/annexures/*`

**Methods:**
- `index()` - List faculty's requests with stats
- `templates()` - Show available templates
- `create()` - Select template to create new request
- `store()` - Create new request
- `edit()` - Edit draft form
- `saveDraft()` - AJAX save draft
- `submit()` - Submit for review
- `show()` - View request status and details
- `downloadPdf()` - Download PDF version
- `auditTimeline()` - AJAX get audit timeline

#### **AdminAnnexureController** (Admin)
Routes: `/admin/annexures/*`

**Methods:**
- `index()` - List pending requests for review
- `myAssignments()` - Requests assigned to me
- `review()` - Review submitted request
- `assign()` - Assign request to self
- `edit()` - AJAX edit form as admin
- `requestRevision()` - Send back for revision
- `approve()` - Approve request
- `sign()` - Digitally sign and finalize
- `reject()` - Reject request
- `templates()` - Manage templates
- `createTemplate()` - Create new template form
- `storeTemplate()` - Save new template
- `editTemplate()` - Edit existing template
- `updateTemplate()` - Update template
- `downloadPdf()` - Download PDF
- `auditTimeline()` - Get audit timeline

## Workflow Sequence

### Faculty Workflow
1. **Create Request**: Select template → create new request (status: draft)
   - AuditLog: "created"
   
2. **Edit Form**: Fill form fields, click "Save Draft"
   - Creates AnnexureData with form_data, marks as valid/invalid
   - AuditLog: "draft_saved" with change tracking

3. **Submit**: Click "Submit for Review" (only if valid)
   - Generates faculty_draft PDF (AnnexureVersion)
   - Status changes to "submitted"
   - AuditLog: "submitted"

4. **Monitor Status**: View request, see audit timeline
   - Can see if in under_review, revision_requested, approved, or signed status
   - Can see audit trail of all actions

5. **Handle Revision**: If status is "revision_requested"
   - Can edit form again and resubmit
   - Creates new AnnexureData version
   - Generates new faculty_draft PDF

### Admin Workflow
1. **Review Queue**: See all submitted requests waiting review
   - Can filter by pending, assigned, approved, signed
   
2. **Assign**: Click "Assign to Me"
   - Status changes to "under_review"
   - assigned_to set to current admin
   - AuditLog: "assigned"

3. **Review Options**:
   - **Request Revision**: Send back with reason
     - Status: "revision_requested"
     - Faculty must re-edit and resubmit
     - Increment revision_count
   
   - **Edit Data**: Directly edit form fields
     - Creates new AnnexureData with admin edit
     - Generates admin_draft PDF
     - Tracks who edited what
   
   - **Approve**: Approve submission
     - Status: "approved"
     - Generates approved PDF (AnnexureVersion)
     - Makes PDF downloadable
   
4. **Sign**: Digitally sign document
   - Status: "signed"
   - Generates final_signed PDF with signature
   - Makes downloadable to faculty
   - AuditLog: "signed" with signature metadata

5. **Reject**: Outright rejection
   - Status: "rejected"
   - Can provide rejection reason

## Form Schema Structure

Templates define form structure as JSON:

```json
{
  "sections": [
    {
      "name": "Section Name",
      "fields": [
        {
          "name": "field_name",
          "label": "Display Label",
          "type": "text|date|number|select|textarea|tel|url|email",
          "required": true,
          "placeholder": "...",
          "options": ["Option1", "Option2"],
          "step": 0.01,
          "rows": 4
        }
      ]
    }
  ]
}
```

## Key Design Patterns

### 1. **Immutable Audit Trail**
- AnnexureAuditLog records are NEVER updated or deleted
- Records all status changes, data edits, PDF generations, downloads
- Includes before/after values for complete change tracking
- IP address and user agent captured for security

### 2. **Versioning**
- AnnexureData: Multiple form data versions (v1, v2, v3, ...)
- AnnexureVersion: Multiple PDF versions with type (faculty_draft → admin_draft → approved → final_signed)
- Previous data stored to track changes
- Change summary automatically generated

### 3. **Role-Based Access**
- Faculty: Can only view/edit own requests in draft/revision_requested status
- Admin: Can review, edit, approve all requests
- Policies and authorization checks in controllers

### 4. **PDF Generation**
- Triggered at: Submit (faculty_draft), Admin Edit (admin_draft), Approve (approved), Sign (final_signed)
- Uses Blade templates with form data
- SHA256 hash for integrity verification
- File size and hash stored

### 5. **Workflow States**
- Clear state machine: draft → submitted → under_review → [revision_requested | approved → signed | rejected]
- Each state has specific allowed actions
- Prevents invalid state transitions

## Sample Seeded Templates

1. **Academic Credentials** (ACADEMIC_CRED)
   - Degree, field of study, university, graduation year, CGPA
   - Requires admin approval
   
2. **Employment History** (EMPLOYMENT_HIST)
   - Designation, department, joining date, employment type
   - Requires admin approval
   
3. **Personal Information** (PERSONAL_INFO)
   - DOB, gender, nationality, phone
   - No admin approval needed
   
4. **Leave Approval Form** (LEAVE_APPROVAL)
   - Leave type, dates, reason
   - Requires admin approval
   
5. **Research Publication Record** (RESEARCH_PUB)
   - Title, authors, journal, year, DOI
   - No admin approval needed

## Integration Points

### PDF Generation
Currently placeholder. Integrate with:
- **Dompdf**: `$pdf = PDF::loadHTML($html)->save(...)`
- **TCPDF**: More advanced control
- **Blade templates**: Render form with data to HTML

### Digital Signature
Currently stores signature as text. Implement with:
- **OpenSSL**: Create PKI-based signatures
- **Drawing Canvas**: HTML5 canvas for signature capture
- **Timestamp Authority**: TSA for non-repudiation

### Email Notifications
Add notifications for:
- Faculty: Request rejected, revision requested, approved, signed
- Admin: New submission, revision resubmitted
- Use Laravel queued jobs (Queue::)

## Running Migrations & Seeders

```bash
# Run all migrations
php artisan migrate

# Seed templates and sample data
php artisan db:seed --class=AnnexureTemplateSeeder

# Or include in DatabaseSeeder::run()
```

## Routes

### Faculty Routes
- GET `/faculty/annexures` - List requests
- GET `/faculty/annexures/templates` - Available templates
- GET `/faculty/annexures/create/{template}` - Create form
- POST `/faculty/annexures/create/{template}` - Store request
- GET `/faculty/annexures/{request}/edit` - Edit form
- POST `/faculty/annexures/{request}/draft` - Save draft
- POST `/faculty/annexures/{request}/submit` - Submit
- GET `/faculty/annexures/{request}` - View request
- GET `/faculty/annexures/{request}/download/{version}` - Download PDF
- GET `/faculty/annexures/{request}/timeline` - Audit timeline

### Admin Routes
- GET `/admin/annexures` - Pending requests
- GET `/admin/annexures/my-assignments` - My work
- GET `/admin/annexures/{request}/review` - Review form
- POST `/admin/annexures/{request}/assign` - Assign to me
- POST `/admin/annexures/{request}/edit` - Edit data
- POST `/admin/annexures/{request}/revision` - Request revision
- POST `/admin/annexures/{request}/approve` - Approve
- POST `/admin/annexures/{request}/sign` - Sign & finalize
- POST `/admin/annexures/{request}/reject` - Reject
- GET `/admin/annexures/templates/manage` - Manage templates
- POST `/admin/annexures/templates` - Create template
- PATCH `/admin/annexures/templates/{template}` - Update template

## Frontend Components (React/Inertia)

Structure: `resources/js/Pages/Faculty/Annexures/` and `resources/js/Pages/Admin/Annexures/`

Components to create:
- Faculty/Index - List requests with filters
- Faculty/Templates - Browse templates
- Faculty/Create - Start new request
- Faculty/Edit - Form editor with auto-save
- Faculty/Show - View status and timeline
- Admin/Index - Pending requests
- Admin/Review - Review and edit form
- Admin/Templates - Manage templates
- Shared/FormBuilder - Dynamic form renderer
- Shared/AuditTimeline - Timeline visualization
- Shared/PdfViewer - Preview PDFs

## Next Steps

1. **Run Migrations**: Execute migrations to create tables
2. **Seed Templates**: Populate sample templates
3. **Create Frontend Components**: React components for Faculty/Admin UIs
4. **Implement PDF Service**: Integrate Dompdf/TCPDF for PDF generation
5. **Add Policies**: Create authorization policies for workflows
6. **Email Notifications**: Add queue jobs for email alerts
7. **Testing**: Create feature tests for workflows
8. **Digital Signature**: Integrate OpenSSL or JWT for signatures

## Success Criteria

✓ Faculty can create, edit, and submit annexures
✓ Admin can review, edit, approve, and sign documents
✓ Complete audit trail of all actions
✓ Proper versioning of both data and PDFs
✓ Role-based access control
✓ PDF generation and storage
✓ Status tracking and workflow state machine
✓ Change tracking with before/after values
