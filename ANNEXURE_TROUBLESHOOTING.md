# Annexure System - Troubleshooting Guide

## Issue: Auto-filled fields are empty

**Cause**: Faculty model doesn't have data for that user

**Solution**:
```bash
# Check if faculty record exists for the user
php artisan tinker
>>> \App\Models\Faculty::where('user_id', 3)->first();

# If not found, create one:
>>> \App\Models\Faculty::create([
    'user_id' => 3,
    'full_name' => 'Dr. John Doe',
    'department' => 'Computer Science',
    'designation_at_joining' => 'Assistant Professor',
    'present_designation' => 'Associate Professor',
    'doj' => '2015-07-01',
    'contact_number' => '9876543210',
    'current_address' => 'Faculty Housing, IIT',
    'is_active' => true,
]);
```

---

## Issue: Form won't submit - validation errors

**Cause**: Required fields are empty or invalid

**Solution**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Fill all fields marked with red asterisk (*)
5. Try again

---

## Issue: Admin doesn't see pending submissions

**Cause**: Status is still "draft" instead of "submitted"

**Solution**:
- Faculty must click "Save & Submit" to change status to "submitted"
- Admin only sees "submitted" status by default
- Check filters on admin dashboard

---

## Issue: Routes not found / 404 errors

**Cause**: Routes not properly registered

**Solution**:
```bash
# Verify routes are registered
php artisan route:list | grep annexure

# Should show 26 routes (13 faculty + 13 admin)
```

---

## Issue: Database tables not created

**Cause**: Migrations not run

**Solution**:
```bash
# Run migrations
./vendor/bin/sail artisan migrate

# Check if tables exist
./vendor/bin/sail artisan tinker
>>> \Illuminate\Support\Facades\Schema::hasTable('annexure_requests');
# Should return: true
```

---## Issue: Seeded templates not showing

**Cause**: Seeder not run or templates marked inactive

**Solution**:
```bash
# Run seeder manually
./vendor/bin/sail artisan db:seed --class=AnnexureTemplateSeeder

# Verify templates are active
./vendor/bin/sail artisan tinker
>>> \App\Models\AnnexureTemplate::active()->count();
# Should return: 5
```

---

## Issue: Faculty data not auto-filling in form

**Cause**: Form component not receiving faculty prop correctly

**Solution**:
1. Check browser DevTools → Network tab
2. Look at API response for `/faculty/annexures/create`
3. Verify response includes `faculty` object with fields
4. If missing, check `AnnexureController::create()` method

---

## Issue: Admin can't approve annexures

**Cause**: Wrong role or missing middleware

**Solution**:
```bash
# Verify user has admin role
./vendor/bin/sail artisan tinker
>>> \App\Models\User::find(1)->role;
# Should return: "admin"

# If not admin, update:
>>> \App\Models\User::find(1)->update(['role' => 'admin']);
```

---

## Issue: Responses with empty arrays

**Cause**: No submissions yet or wrong filters

**Solution**:
1. Create a test submission first
2. Check filter parameters in URL
3. Verify user ID matches

---

## Issue: Component rendering white screen

**Cause**: Missing props or errors in component

**Solution**:
1. Check browser console for errors
2. Verify props are being passed from controller
3. Look at React DevTools for prop values

---

## Issue: Database foreign key errors

**Cause**: Trying to delete template with active submissions

**Solution**:
```bash
# Check if template is in use
./vendor/bin/sail artisan tinker
>>> \App\Models\AnnexureTemplate::find(1)
    ->annexureRequests()
    ->count();

# Can't delete if count > 0
# Instead, mark as inactive:
>>> \App\Models\AnnexureTemplate::find(1)
    ->update(['status' => 'inactive']);
```

---

## Issue: PDF download not working

**Cause**: PDF generation not yet implemented (feature ready for addition)

**Solution**:
1. This feature is architected but not yet implemented
2. To add: Install Dompdf/TCPDF and create Blade templates
3. Infrastructure is in place - just needs PDF renderer

---

## Issue: Signature not being saved

**Cause**: Digital signature feature ready for implementation

**Solution**:
1. Signature infrastructure exists in database
2. UI component needs implementation
3. Add HTML5 Canvas component to `Sign.jsx`

---

## Issue: Email notifications not sending

**Cause**: Email notifications not yet implemented

**Solution**:
1. Service hooks are prepared in AnnexureService
2. To add: Configure mail settings in `.env`
3. Uncomment email calls in service methods

---

## Performance Issues

**If system is slow**:

1. Check database indexes:
```bash
./vendor/bin/sail artisan tinker
>>> \DB::statement('SHOW INDEX FROM annexure_requests');
```

2. Add pagination:
- Already implemented (15 items per page)

3. Use eager loading:
- Already used with `.with()` in controllers

---

## Common Configuration Errors

### Missing APP_KEY
```bash
./vendor/bin/sail artisan key:generate
```

### Database not connecting
```bash
# Check .env file
# Verify docker containers running
docker compose ps
```

### Routes middleware not applied
```bash
# Check routes/web.php or api.php
# Should have middleware(['auth', 'role:faculty'])
```

---

## Development Workflow

### To add new field to template:

1. Update JSON schema in `AnnexureTemplateSeeder.php`
2. Re-seed: `artisan db:seed --class=AnnexureTemplateSeeder`
3. Form automatically renders new field

### To change status colors:

1. Edit `statusBadges` object in Index components
2. Tailwind CSS classes are used for colors
3. Update all status badges consistently

### To add email notification:

1. Create mailable: `php artisan make:mail AnnexureStatusChanged`
2. Add to service method: `Mail::send(new AnnexureStatusChanged())`
3. Update `.env` with mail credentials

---

## Debugging Tips

### Enable Query Logging
```php
// In controller
\DB::enableQueryLog();
// ... your code ...
dd(\DB::getQueryLog());
```

### Check Audit Logs
```bash
./vendor/bin/sail artisan tinker
>>> \App\Models\AnnexureAuditLog::where('annexure_request_id', 1)->get();
```

### View Current Status
```bash
./vendor/bin/sail artisan tinker
>>> \App\Models\AnnexureRequest::find(1)->status;
```

### Check Form Data Stored
```bash
./vendor/bin/sail artisan tinker
>>> \App\Models\AnnexureData::where('annexure_request_id', 1)->latest()->first()->form_data;
```

---

## Performance Optimization Checklist

- ✅ Database indexes on key columns
- ✅ Eager loading with .with()
- ✅ Pagination (15 items/page)
- ⏳ Caching (can be added)
- ⏳ Query optimization (can be added)

---

## Security Checklist

- ✅ Role-based middleware
- ✅ Input validation
- ✅ SQL injection prevention (ORM)
- ✅ CSRF protection (Laravel)
- ✅ Soft deletes
- ✅ Audit logging
- ⏳ Rate limiting (can be added)
- ⏳ 2FA (can be added)

---

## Support

For issues not listed here:

1. Check logs: `storage/logs/laravel.log`
2. Check database: Verify data integrity
3. Check frontend: Browser DevTools console
4. Check backend: `php artisan tinker` for debugging

