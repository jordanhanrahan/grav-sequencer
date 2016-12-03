# Sequencer Plugin

The **Sequencer** Plugin is for [Grav CMS](http://github.com/getgrav/grav). Creates a HTML5 drum machine

## Installation

Installing the Sequencer plugin can be done in one of two ways. The GPM (Grav Package Manager) installation method enables you to quickly and easily install the plugin with a simple terminal command, while the manual method enables you to do so via a zip file.

### GPM Installation (Preferred)

The simplest way to install this plugin is via the [Grav Package Manager (GPM)](http://learn.getgrav.org/advanced/grav-gpm) through your system's terminal (also called the command line).  From the root of your Grav install type:

    bin/gpm install sequencer

This will install the Sequencer plugin into your `/user/plugins` directory within Grav. Its files can be found under `/your/site/grav/user/plugins/sequencer`.

### Manual Installation

To install this plugin, just download the zip version of this repository and unzip it under `/your/site/grav/user/plugins`. Then, rename the folder to `sequencer`. You can find these files on [GitHub](https://github.com/jordan-hanrahan/grav-plugin-sequencer) or via [GetGrav.org](http://getgrav.org/downloads/plugins#extras).

You should now have all the plugin files under

    /your/site/grav/user/plugins/sequencer
	
> NOTE: This plugin is a modular component for Grav which requires [Grav](http://github.com/getgrav/grav) and the [Error](https://github.com/getgrav/grav-plugin-error) and [Problems](https://github.com/getgrav/grav-plugin-problems) to operate.

## Configuration

Before configuring this plugin, you should copy the `user/plugins/sequencer/sequencer.yaml` to `user/config/plugins/sequencer.yaml` and only edit that copy.

Here is the default configuration and an explanation of available options:

```yaml
enabled: true
```

## Usage

The HTML5 sequencer will be appended to pages using the 'sequencer' template (based on the default template from Grav's Antimatter Theme)

## Credits

Based on the excellent html5 sequencer built by Andrew Seigner
[https://github.com/siggy/beatboxer](GitHub)
[http://sig.gy/](Website)
Sounds originally from: [http://808.html909.com]()

## To Do

- [ ] Change usage to one based on shortcodes so it can be independent of the template.

