# [freshlinks.org](http://freshlinks.org)

## Introduction

Fresh links is a cloud-based RSS reader built with WordPress. The user’s posts appear in a timeline and are stripped free of ads, superfluous HTML, and with their full text. The articles can be automatically deleted after some amount of time has passed (to prevent inbox build up), listed in the timeline indefinitely, or saved into a separate section.

## Basic user flow

A first time user:

* Creates an account.
* Goes to the settings page.
* Adds the RSS URLs to feeds the user wants to follow.
* Goes to the New page.
* Hits the in-page refresh button.

New posts will appear. The user will then click each post to reveal the contents.

The posts can be saved or deleted.

## Credits

This project is built with [WordPress](https://wordpress.org) and uses the [Advanced Custom Fields](http://www.advancedcustomfields.com) and [wp category meta](https://wordpress.org/plugins/wp-category-meta/) plugins.

HTML scrubbing is done with [Readability](https://bitbucket.org/fivefilters/php-readability/overview).

RSS retrieval is done with the [Google Feed API](https://developers.google.com/feed/).
