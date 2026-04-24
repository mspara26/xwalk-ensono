export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }

      // convert .mp4 links to inline video elements
      const videoLink = col.querySelector('a[href$=".mp4"]');
      if (videoLink) {
        const video = document.createElement('video');
        video.src = videoLink.href;
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.setAttribute('playsinline', '');
        video.muted = true;
        const wrapper = videoLink.closest('p') || videoLink.parentElement;
        wrapper.replaceWith(video);
        col.classList.add('columns-video-col');
      }
    });
  });
}
