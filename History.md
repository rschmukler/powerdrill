
0.3.0 / 2016-11-26
==================

  * feature: Add handlebars merge language support
  * feature: Add ability to set send_at dates

0.2.19 / 2015-11-02
==================

  * Make attach and image return the message and update tests accordingly
  * Add inline image functionality [thanks @pthm[

0.2.18 / 2015-09-17
==================

  * Add ability to set recipient as cc or bcc

0.2.17 / 2015-08-19
==================

  * Allow sending to duplicate email addresses (as per warning error message)

0.2.16 / 2015-02-01
==================

  * add duplicate email address detection

0.2.15 / 2015-01-24
==================

  * add support for array type responses from mandrill

0.2.14 / 2015-01-24
==================

  * Properly handle reject errors from mandrill

0.2.13 / 2015-01-15
==================

  * add clearing of template when setting html

0.2.12 / 2014-12-09
==================

  * switch track_opens and track_clicks to be undefined by default, using mandrills account settings

0.2.11 / 2014-10-19
==================

 * provide access to headers

0.2.10 / 2014-10-17
==================

 * add bcc functionality
 * add trackClicks and trackOpens

0.2.9 / 2014-09-19
==================

 * implement templateContent [closes #6]

0.2.8 / 2014-08-27
==================

 * Can now add attachments to the email [@MuzzleFork]

0.2.7 / 2014-07-29
==================

 * Add ability to send plain-text emails or HTML and plain text emails.

0.2.6 / 2014-07-13
==================

 * fix intercepting with no message vars

0.2.5 / 2014-07-13
==================

 * fix syntax error. Doh

0.2.4 / 2014-07-13
==================

 * add support for sending pure html

0.2.3 / 2014-05-15
==================

 * Add optional support for Mandrill subaccounts

0.2.2 / 2014-01-07
==================

 * Added skip option to builder and message

0.2.1 / 2014-01-06
==================

 * Added option to intercept to builder

0.2.0 / 2014-01-06
==================

 * Refactored to return a message builder by default

0.1.1 / 2014-01-06
==================

 * Changed .send's cb signature to cb(err, body) instead of cb(body) -- more node like

0.1.0 / 2014-01-05
==================

 * Initial release. Pretty damn good lads
