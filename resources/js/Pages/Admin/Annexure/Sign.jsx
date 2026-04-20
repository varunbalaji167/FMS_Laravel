import { useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { AlertCircle, PenTool, Upload } from 'lucide-react';

export default function SignAnnexure({ annexure }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signatureType, setSignatureType] = useState('drawn');
    const [uploadedSignature, setUploadedSignature] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Canvas drawing
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const saveSignature = async () => {
        if (!signatureType) {
            alert('Please select signature type');
            return;
        }

        let signatureData = '';

        if (signatureType === 'drawn') {
            const canvas = canvasRef.current;
            // Check if canvas is empty
            const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            if (!imageData.data.some(channel => channel !== 0)) {
                alert('Please draw a signature');
                return;
            }
            signatureData = canvas.toDataURL('image/png');
        } else {
            if (!uploadedSignature) {
                alert('Please upload a signature');
                return;
            }
            signatureData = uploadedSignature;
        }

        if (!confirm('Are you sure you want to sign this document?')) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(route('admin.annexures.save-signature', annexure.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    signature_data: signatureData,
                    signature_type: signatureType,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save signature');
            }

            alert('Signature saved successfully!');
            window.location.href = route('admin.annexures.index');
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setUploadedSignature(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-900">
                    Sign Annexure - {annexure.name}
                </h2>
            }
        >
            <div className="max-w-5xl mx-auto">
                {/* Info */}
                <Card className="mb-6 bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-blue-900">
                                    Digital Signature Required
                                </p>
                                <p className="text-sm text-blue-800 mt-1">
                                    Please sign this document using either a drawn signature or an
                                    uploaded signature image. This signature will be embedded in the
                                    final PDF document.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Document Info */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Document Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600">Faculty</p>
                                <p className="font-semibold">{annexure.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Document Type</p>
                                <p className="font-semibold">{annexure.template?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <p className="font-semibold">Approved - Ready to Sign</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Approved Date</p>
                                <p className="font-semibold">
                                    {new Date(annexure.reviewed_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Signature Method Selection */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Choose Signature Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Drawn Signature */}
                            <div>
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="signatureType"
                                        value="drawn"
                                        checked={signatureType === 'drawn'}
                                        onChange={(e) => setSignatureType(e.target.value)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <p className="font-semibold flex items-center gap-2">
                                            <PenTool className="w-4 h-4" />
                                            Draw Signature
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Sign using your mouse or touchpad
                                        </p>
                                    </div>
                                </label>

                                {signatureType === 'drawn' && (
                                    <div className="mt-4 ml-7">
                                        <div className="border-2 border-gray-300 rounded bg-white">
                                            <canvas
                                                ref={canvasRef}
                                                width={500}
                                                height={150}
                                                onMouseDown={startDrawing}
                                                onMouseMove={draw}
                                                onMouseUp={stopDrawing}
                                                onMouseLeave={stopDrawing}
                                                className="w-full border-b border-gray-200 cursor-crosshair"
                                                style={{ display: 'block' }}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={clearCanvas}
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                        >
                                            Clear Signature
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Uploaded Signature */}
                            <div>
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="signatureType"
                                        value="uploaded"
                                        checked={signatureType === 'uploaded'}
                                        onChange={(e) => setSignatureType(e.target.value)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <p className="font-semibold flex items-center gap-2">
                                            <Upload className="w-4 h-4" />
                                            Upload Signature Image
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Upload a PNG or JPG image of your signature
                                        </p>
                                    </div>
                                </label>

                                {signatureType === 'uploaded' && (
                                    <div className="mt-4 ml-7">
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg"
                                            onChange={handleFileUpload}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded"
                                        />
                                        {uploadedSignature && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                                                <img
                                                    src={uploadedSignature}
                                                    alt="Uploaded signature"
                                                    className="max-w-xs max-h-32"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        onClick={saveSignature}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        {isSubmitting ? 'Signing...' : 'Sign & Complete'}
                    </Button>
                    <Button
                        onClick={() => window.history.back()}
                        variant="outline"
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
