import { useEffect, useState } from 'react';
import { enableVisualEditing } from '@sanity/visual-editing';
import { sanity } from '../lib/sanityClient';
import { renderPortableText } from '../utils/renderPortableText';

type Post = {
  title: string;
  mainImage?: { asset?: { url: string } };
  body?: any[];
};

export default function LivePreviewClient() {
  const [post, setPost] = useState<Post | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    enableVisualEditing();

    const urlSlug = new URLSearchParams(window.location.search).get('slug');
    if (!urlSlug) return;

    setSlug(urlSlug);

    const subscription = sanity
      .listen(`*[_type == "post" && slug.current == $slug][0]`, {
        slug: urlSlug,
      })
      .subscribe((update: any) => {
        if (update.result) {
          setPost(update.result as Post);
        }
      });

    return () => subscription.unsubscribe();
  }, []);

  if (!slug) return <p className='p-8'>No slug provided.</p>;
  if (!post) return <p className='p-8'>Loading preview...</p>;

  const htmlBody = post.body ? renderPortableText(post.body) : '';

  return (
    <main className='p-8 max-w-3xl mx-auto'>
      <h1 className='text-4xl font-bold mb-6'>{post.title}</h1>

      {post.mainImage?.asset?.url && (
        <img
          src={post.mainImage.asset.url}
          alt={post.title}
          className='w-full h-64 object-cover rounded-xl mb-6'
        />
      )}

      <article
        className='prose prose-lg max-w-none'
        dangerouslySetInnerHTML={{ __html: htmlBody }}
      />
    </main>
  );
}
