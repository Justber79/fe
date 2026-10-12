import { ArrowLeft, DownloadSimple, MagnifyingGlassPlus, Minus, Plus, Trash } from "@phosphor-icons/react";
import { useState } from "react";
import styled from "styled-components";
import { DialogOverlay } from "./shared/DialogOverlay";

type Props = {
  isOpen: boolean;
  documentName: string;
  documentUrl: string | null;
  onClose: () => void;
  onDownload: () => void;
  onDelete: () => void;
};

const ContentArea = styled.div`
  position: relative;
  width: var(--document-preview-width);
  height: var(--document-preview-height);
  max-width: var(--document-preview-max-width);
  max-height: var(--document-preview-max-height);
  background: var(--document-preview-background);
  box-shadow: var(--document-preview-shadow);
`;

const PreviewBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: var(--document-preview-bar-padding);
  gap: var(--document-preview-bar-gap);
  position: absolute;
  width: 100%;
  height: var(--document-preview-bar-height);
  left: 0px;
  top: 0px;
  background: var(--document-preview-bar-background);
  z-index: var(--document-preview-bar-z-index);
`;

const DocumentNameSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: var(--document-preview-name-section-gap);
`;

const BackButton = styled.button`
  width: var(--document-preview-button-size);
  height: var(--document-preview-button-size);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--document-preview-name-color);
  padding: 0;

  &:hover {
    opacity: var(--document-preview-button-hover-opacity);
  }
`;

const DocumentName = styled.div`
  font-style: normal;
  font-weight: var(--document-preview-name-font-weight);
  font-size: var(--document-preview-name-font-size);
  line-height: var(--document-preview-name-line-height);
  display: flex;
  align-items: center;
  letter-spacing: var(--document-preview-name-letter-spacing);
  color: var(--document-preview-name-color);
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  gap: var(--document-preview-actions-gap);
`;

const IconButton = styled.button`
  width: var(--document-preview-button-size);
  height: var(--document-preview-button-size);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--document-preview-name-color);
  padding: 0;

  &:hover {
    opacity: var(--document-preview-button-hover-opacity);
  }
`;

const DocumentContainer = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% - var(--document-preview-bar-height));
  top: var(--document-preview-bar-height);
  left: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
  padding: var(--document-preview-container-padding);
`;

const DocumentFrame = styled.div<{ $scale: number }>`
  width: var(--document-preview-frame-width);
  height: var(--document-preview-frame-height);
  background: var(--document-preview-frame-background);
  box-shadow: var(--document-preview-frame-shadow);
  transform: scale(${(props) => props.$scale});
  transform-origin: top center;
  transition: var(--transition-transform);
`;

const PDFEmbed = styled.object`
  width: 100%;
  height: 100%;
  border: none;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ZoomControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: var(--document-preview-zoom-controls-padding);
  gap: var(--document-preview-zoom-controls-gap);
  position: absolute;
  bottom: var(--document-preview-zoom-controls-bottom);
  left: 50%;
  transform: translateX(-50%);
  background: var(--document-preview-zoom-controls-background);
  opacity: var(--document-preview-zoom-controls-opacity);
  border-radius: var(--document-preview-zoom-controls-border-radius);
  z-index: var(--document-preview-zoom-controls-z-index);
`;

const ZoomButton = styled.button`
  width: var(--document-preview-button-size);
  height: var(--document-preview-button-size);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--document-preview-name-color);
  padding: 0;

  &:hover {
    opacity: var(--document-preview-button-hover-opacity);
  }

  &:disabled {
    opacity: var(--document-preview-zoom-button-disabled-opacity);
    cursor: not-allowed;
  }
`;

export function DocumentPreviewDialog({ isOpen, documentName, documentUrl, onClose, onDownload, onDelete }: Props) {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1);
  };

  const fileExtension = documentUrl?.split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "");
  const isPdf = fileExtension === "pdf";

  return (
    <DialogOverlay isOpen={isOpen} onClose={onClose} zIndex={10002}>
      <ContentArea onClick={(e) => e.stopPropagation()}>
        <PreviewBar>
          <DocumentNameSection>
            <BackButton onClick={onClose} aria-label="Close preview">
              <ArrowLeft size={24} weight="regular" />
            </BackButton>
            <DocumentName>{documentName}</DocumentName>
          </DocumentNameSection>
          <ActionButtons>
            <IconButton onClick={onDownload} aria-label="Download document">
              <DownloadSimple size={24} weight="regular" />
            </IconButton>
            <IconButton onClick={onDelete} aria-label="Delete document">
              <Trash size={24} weight="regular" />
            </IconButton>
          </ActionButtons>
        </PreviewBar>

        <DocumentContainer>
          <DocumentFrame $scale={scale}>
            {documentUrl ? (
              isImage ? (
                <ImagePreview src={documentUrl} alt={documentName} />
              ) : isPdf ? (
                <PDFEmbed data={`${documentUrl}#toolbar=0&navpanes=0`} type="application/pdf" aria-label={documentName}>
                  <p>
                    Your browser does not support PDFs. <a href={documentUrl}>Download the PDF</a>.
                  </p>
                </PDFEmbed>
              ) : (
                <p>
                  Unsupported file type. <a href={documentUrl}>Download the file</a>.
                </p>
              )
            ) : (
              <p>No document URL provided.</p>
            )}
          </DocumentFrame>
        </DocumentContainer>

        <ZoomControls data-testid="document-preview-zoom-controls">
          <ZoomButton onClick={handleZoomOut} disabled={scale <= 0.5} aria-label="Zoom out">
            <Minus size={24} weight="regular" />
          </ZoomButton>
          <ZoomButton onClick={handleZoomReset} aria-label="Reset zoom">
            <MagnifyingGlassPlus size={24} weight="regular" />
          </ZoomButton>
          <ZoomButton onClick={handleZoomIn} disabled={scale >= 2} aria-label="Zoom in">
            <Plus size={24} weight="regular" />
          </ZoomButton>
        </ZoomControls>
      </ContentArea>
    </DialogOverlay>
  );
}
