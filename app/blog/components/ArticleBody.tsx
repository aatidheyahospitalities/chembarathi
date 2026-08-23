import Image from 'next/image';
import {
  documentToReactComponents,
  type Options,
} from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';

import type { ContentfulAssetType, RichTextType } from '@/app/lib/type';
import { assetAlt } from '../utils';

type EmbeddedAsset = ContentfulAssetType & { sys: { id: string } };

/**
 * The article body.
 *
 * Structural nodes fall through to the renderer's default HTML, which
 * `.article-body` in styles/typography.css then styles with the design tokens.
 * Only three things need overriding: bold (the default emits `<b>`, and the
 * stylesheet targets `<strong>`), embedded images (the default renders
 * nothing), and hyperlinks (external ones need rel/target).
 */
export default function ArticleBody({
  content,
  title,
}: Readonly<{ content: RichTextType | null; title: string }>) {
  if (!content?.json) return null;

  // The document references embedded assets by id only; the full records
  // arrive alongside it under `links`.
  const assets = new Map<string, EmbeddedAsset>(
    (content.links?.assets?.block ?? [])
      .filter((asset): asset is EmbeddedAsset => Boolean(asset?.sys?.id))
      .map(asset => [asset.sys.id, asset])
  );

  const options: Options = {
    renderMark: {
      [MARKS.BOLD]: text => <strong>{text}</strong>,
    },
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: node => {
        const asset = assets.get(node.data?.target?.sys?.id);
        if (!asset?.url) return null;

        const width = asset.width ?? 1600;
        const height = asset.height ?? 1067;

        return (
          <figure>
            <Image
              src={asset.url}
              alt={assetAlt(asset, title)}
              width={width}
              height={height}
              sizes="(max-width: 768px) 100vw, 760px"
              className="h-auto w-full"
            />
            {asset.description ? (
              <figcaption>{asset.description}</figcaption>
            ) : null}
          </figure>
        );
      },

      [INLINES.HYPERLINK]: (node, children) => {
        const uri: string = node.data?.uri ?? '';
        const isExternal = /^https?:\/\//.test(uri);

        return (
          <a
            href={uri}
            {...(isExternal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {children}
          </a>
        );
      },
    },
  };

  return (
    <div className="article-body">
      {documentToReactComponents(content.json, options)}
    </div>
  );
}
