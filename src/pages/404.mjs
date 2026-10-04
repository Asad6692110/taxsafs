import { arrow } from '../components.mjs';

export default {
  path: '404.html',
  current: '',
  absolute: true, // served for any missing URL, so links must not be relative
  noindex: true,
  title: 'Page not found | Smart Ample Financial Services',
  description: 'The page you are looking for could not be found.',
  body: (root) => `
<section class="ihero" style="min-height:70svh">
  <div class="container">
    <p class="eyebrow eyebrow--plain">Error 404</p>
    <h1 class="display">This page<br> could not be found.</h1>
    <p class="ihero__text">The link may be out of date, or the page may have moved.</p>
    <div class="actions" style="margin-top:40px">
      <a class="btn btn--primary" href="${root}index.html">Back to Home ${arrow}</a>
      <a class="btn btn--ghost" href="${root}contact.html">Contact Us</a>
    </div>
  </div>
</section>`,
};
