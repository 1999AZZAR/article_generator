export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname;

    // List of internal subdomains to DE-INDEX
    const blockedSubdomains = [
      'portainer.glassgallery.my.id',
      'pihole.glassgallery.my.id',
      'hub.glassgallery.my.id',
      'mail.glassgallery.my.id',
      'flow.glassgallery.my.id',
      'monitor.glassgallery.my.id',
      'loc.glassgallery.my.id',
      'jupyter.glassgallery.my.id',
      'mikhmon.glassgallery.my.id',
      'invoice.glassgallery.my.id',
      'invitation.glassgallery.my.id',
      'lebaran.glassgallery.my.id',
      'hbd.glassgallery.my.id',
      'congrats.glassgallery.my.id',
      'ubuntu.glassgallery.my.id',
      'ubuntu2.glassgallery.my.id'
    ];

    // List of public subdomains to INDEX
    const publicSubdomains = [
      'glassgallery.my.id',
      'prism.glassgallery.my.id',
      'wp.glassgallery.my.id',
      'geometry-vault.glassgallery.my.id',
      'quill.glassgallery.my.id',
      'mema.glassgallery.my.id',
      'wikistream.glassgallery.my.id',
      'lumina.glassgallery.my.id',
      'ellis.glassgallery.my.id',
      'radio.glassgallery.my.id',
      'yearbook.glassgallery.my.id'
    ];

    // 1. Handle robots.txt
    if (url.pathname === '/robots.txt') {
      if (blockedSubdomains.includes(host)) {
        return new Response('User-agent: *\nDisallow: /', {
          headers: { 'Content-Type': 'text/plain' }
        });
      }

      let robots = [
        'User-agent: *',
        'Allow: /',
        ''
      ];

      // Point specific subdomains to their own sitemaps if they exist
      if (host === 'wp.glassgallery.my.id') {
        robots.push('Sitemap: https://wp.glassgallery.my.id/sitemap_index.xml');
      } else if (host === 'prism.glassgallery.my.id') {
        // Fallback for prism if it doesn't have its own yet, or point to root sitemap
        robots.push('Sitemap: https://glassgallery.my.id/sitemap.xml');
      } else {
        robots.push('Sitemap: https://glassgallery.my.id/sitemap.xml');
      }

      return new Response(robots.join('\n'), {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // 2. Handle sitemap.xml (central hub)
    if (url.pathname === '/sitemap.xml' && host === 'glassgallery.my.id') {
      const now = new Date().toISOString();
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        // Add root itself
        `  <sitemap><loc>https://glassgallery.my.id/sitemap_root.xml</loc></sitemap>`,
        // Add WordPress sitemap index
        `  <sitemap><loc>https://wp.glassgallery.my.id/sitemap_index.xml</loc></sitemap>`,
        // Add other public subdomains as individual sitemaps or entries
        ...publicSubdomains.filter(s => s !== 'wp.glassgallery.my.id' && s !== 'glassgallery.my.id').map(sub => `
          <sitemap><loc>https://${sub}/sitemap.xml</loc></sitemap>`),
        '</sitemapindex>'
      ].join('\n');

      return new Response(sitemap, {
        headers: { 'Content-Type': 'application/xml' }
      });
    }

    // 2.1 Handle sitemap_root.xml (The actual links for the public entries)
    if (url.pathname === '/sitemap_root.xml' || (url.pathname === '/sitemap.xml' && host !== 'glassgallery.my.id' && publicSubdomains.includes(host))) {
       const now = new Date().toISOString();
       const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...publicSubdomains.map(sub => `
          <url>
            <loc>https://${sub}/</loc>
            <lastmod>${now.split('T')[0]}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>${sub === 'glassgallery.my.id' ? '1.0' : '0.8'}</priority>
          </url>`),
        '</urlset>'
      ].join('\n');
      return new Response(sitemap, {
        headers: { 'Content-Type': 'application/xml' }
      });
    }

    // 3. Fallback: Proxy or just 404 (This worker is usually a route handler)
    // If it's a blocked subdomain, add noindex headers to the response (if used as a middleware)
    // But since this is a dedicated SEO worker, we just return 404 for other paths
    return new Response('GlassGallery SEO Engine', { status: 200 });
  }
};
