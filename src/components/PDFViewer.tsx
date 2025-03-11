import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
  buttonText?: string;
  buttonClassName?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  title = 'Vista Previa de PDF',
  buttonText = 'Ver PDF',
  buttonClassName = ''
}) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 ${buttonClassName}`}
        >
          <FileText className="w-4 h-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-5xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title={title}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer; 