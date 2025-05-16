// src/components/RichTextRenderer.tsx
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import Image from 'next/image';
import Link from 'next/link';

export default function RichTextRenderer({ content, contentLinks }) {
  // Function to get asset details from references
  const getAsset = (assetId) => {
    if (!contentLinks?.assets?.block) return null;

    return contentLinks.assets.block.find((asset) => asset.sys.id === assetId);
  };

  const options = {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
      [MARKS.CODE]: (text) => <code className="inline-code">{text}</code>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
      [BLOCKS.HEADING_1]: (node, children) => <h1>{children}</h1>,
      [BLOCKS.HEADING_2]: (node, children) => (
        <h2 id={createSlug(children)}>{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node, children) => (
        <h3 id={createSlug(children)}>{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (node, children) => (
        <h4 id={createSlug(children)}>{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (node, children) => <h5>{children}</h5>,
      [BLOCKS.HEADING_6]: (node, children) => <h6>{children}</h6>,
      [BLOCKS.UL_LIST]: (node, children) => <ul>{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol>{children}</ol>,
      [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
      [BLOCKS.QUOTE]: (node, children) => <blockquote>{children}</blockquote>,
      [BLOCKS.HR]: () => <hr />,
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const assetId = node.data.target.sys.id;
        const asset = getAsset(assetId);

        if (!asset) return null;

        return (
          <div className="embedded-asset">
            <Image
              src={asset.url}
              alt={asset.description || asset.title || ''}
              width={asset.width || 800}
              height={asset.height || 600}
              className="content-image"
            />
            {asset.description && <figcaption>{asset.description}</figcaption>}
          </div>
        );
      },
      [INLINES.HYPERLINK]: (node, children) => {
        const { uri } = node.data;

        // External links
        if (uri.startsWith('http')) {
          return (
            <a href={uri} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        }

        // Internal links
        return <Link href={uri}>{children}</Link>;
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        // Handle embedded entries (if you have any)
        return <div>Embedded entry</div>;
      },
    },
  };

  return <>{documentToReactComponents(content, options)}</>;
}

// Helper function to create slug from heading text
function createSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
