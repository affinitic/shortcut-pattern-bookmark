# Shortcut Pattern Bookmark

This extension is used to create shortcut base on a pattern as bookmark for a type of website (eg: Plone, Wordpress, ...)

## Installation
1. Clone this repo.
1. In Chrome, go to Window/Extensions. In Arc go to Extensions/Manage Extension.
1. Activate the developer mode.
1. Click on "Load unpacked" and select the dist folder.
1. To install the plone preset, click on "Import" button (Up arrow) and select "Preset-plone.json" in the repo.

## Using
If you click on one of the shortcut, it will use the url of the current tab, and override the url of the current tab. 
If you press the option key (or alt for Windows), it will create a new tab.

### Create a new shortcut
Click on the "+" icon at the bottom of the extension window. 
You can enter a name for the shortcut and a pattern.
Here's a list of the variables you can use:

- {%scheme%} : Scheme of the url (eg: http or https)
- {%domain%} : Domain name of the url
- {%port%} : Port of the url (and site root); if there is no port, it will be ignored
- {%start%} : Concatenation of scheme, domain and port of the url
- {%path%} : Path of the url; if there is no path, it will be ignored
- {%query%} : Query of the url (part after "?"); if there is no query, it will be ignored

### Edit the current shortcut
Click on the "pen" icon at the bottom of the extension window. You can edit the shortcut name and pattern by clicking on the shortcut name, delete it by clicking on the trash icon or you can reorder the shortcuts by drag and drop.

### Export import
You can export and import shortcut and port settings by clicking on the arrow at the bottom of the extension window. By default when you export the action is set to 'set', in these case when imported it will override every thing already set, it can also be set to 'add', with that the content of the file will be append to the existing settings. The id part is not required, it will be generated at import.

## What's next
- Add edition of a shortcut (change name and patern)
- Add settings window
- Add the possibility to customize the root site
- Create a Firefox version
- Create an icon
- Publish on the extension library
- Add folder to arrange shortcut

## Contributors
- [@jimbiscuit](https://github.com/jimbiscuit) 
