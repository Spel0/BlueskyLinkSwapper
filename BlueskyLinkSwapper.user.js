// ==UserScript==
// @name         Swap bsky copy link to fxbsky
// @namespace    https://github.com/Spel0/BlueskyLinkSwapper
// @version      1.0
// @description  Replace `bsky` to `fxbsky` when clicking 'Copy link to post'
// @author       Spelo
// @match        https://bsky.app/*
// @icon         https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:z72i7hdynmk6r22z27h6tvur/bafkreigdqcikm3d7ipdgp2ssgylnzwv76gyp6ogrndopl2dfzl5iryp2x4@jpeg
// @license      BSD-3-Clause
// ==/UserScript==

(function () {
  "use strict";

  // Check if the clipboardchange event is supported (Bluesky doesn't send copy events)
  if ('onclipboardchange' in navigator.clipboard) {
    // The clipboardchange event is supported (Direct event)
    console.debug("ClipboardChange Event is Supported")
    navigator.clipboard.addEventListener('clipboardchange', checkClipboard);
  } else {
    // Fallback to polling
    console.debug("ClipboardChange Event is Not Supported")
    setInterval(() => {
      checkClipboard();
    }, 100);
  }

  // Entry point for events
  function checkClipboard() {
    navigator.clipboard.readText().then((text) => { // Requires browser clipboard privileges to be enabled
      if (isValidBskyUrl(text)) {
        replaceUrl(text);
      }
    });
  }

  // Validate if the text is a valid Bluesky URL
  function isValidBskyUrl(url) {
    const urlRegex = /^https:\/\/(www\.)?bsky\.app\/profile\/.+\/post\/\d+/;
    return urlRegex.test(url);
  }

  // Replace the domain part of the Bluesky URL with 'fxbsky'
  function replaceUrl(originalUrl) {
    try {
      let newUrl = originalUrl.replace(/bsky\.app/, "fxbsky.app");
      navigator.clipboard.writeText(newUrl);
    } catch (error) {
      console.error("Error replacing URL:", error);
    }
  }
})();