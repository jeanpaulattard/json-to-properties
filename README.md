# json-to-properties

[![npm version](https://badge.fury.io/js/json-to-properties.svg)](https://badge.fury.io/js/json-to-properties)

A util to convert files in .json format into .properties format, and vice versa.

## Installation

`npm install json-to-properties -g`

## Usage

Running `json-to-properties` will convert any .json file that are found in the current directory, into to .properties.

Example

```
{
    "KEY1": {
        "KEY2": "Hello"
    },
    "KEY3":"World"
}
```

result into a file containing

```
KEY1.KEY2=Hello
KEY3=World
```

## Options

Various options are supported, including

### -c, --config

Running the util with -c expects a config file in .json format containing two attributes: `src` and `dist`, where 
- `src` points to the directory containing the files to process and 
- `dist` points to the directory where the output files will be written

Example config.json

```
{
    src: "c:\json\myfiles",
    dist: "c:\properties\myconvertedfiles"
}
```

and run with 

`json-to-properties -c config.json`

### -r, --reverse

Performs the reversal process, converting .properties files into .json files.

Example 
```
KEY1.KEY2=Hello
KEY3=World
```

result into a file containing

```
{
    "KEY1": {
        "KEY2": "Hello"
    },
    "KEY3":"World"
}
```


### -s, --spaces

Accepts a number value identifying the number of spaces used within the output .json file. This is used in relation with `-r`

Run using 

`json-to-properties -r -s 4`

will use 4 spaces for each indented hierarchy.

### -m, --merge

Running the util with the -m, --merge option bundles the generated properties files into one file of a given name, or bundle.properties if none is specified. The content of the bundled file are prefixed with the name of the original file.

##### Example

`json-to-properties -m` bundles the content in a file named bundle.properties

`json-to-properties -m mynewbundle.properties` bundles the content in a file named mynewbundle.properties

Having two files `en.json` and `it.json` both containing the json content below

```
{
    "KEY1" : "Hello Sir",
    "KEY2" : "How is your day?"
}
```    

will result in a bundle file `bundle.properties` having the below content.

```
EN.KEY1=Hello Sir
EN.KEY2=How is your day?
IT.KEY1=Hello Sir
IT.KEY2=How is your day?
```

_Note that the standard behavior is preserved, thus two properties files `en.properties` and `it.properties` are also created._

#### Use of merge in conjunction with -r, --reverse option

The merge process can also be combined with the -r, -reverse flag, where the specified file (or bundle.properties if none is specified) is expanded into separate json files whose name is equivalent to the first part of a key.

##### Example

`json-to-properties -m` or `json-to-properties -rm`

Having a bundle file `bundle.properties` with the below content

```
EN.KEY1=Hello Sir
EN.KEY2=How is your day?
IT.KEY1=Salve signore
IT.KEY2=Com'è la tua giornata?
```

will result in two files, `en_rm.json` and `it_rm.json`, having the below content respectively.

```
{
    "KEY1": "Hello Sir",
    "KEY2": "How is your day?"
}
```

and 

```
{
    "KEY1": "Salve signore",
    "KEY2": "Com'è la tua giornata?"
}
```

_Note that the generated json files are suffixed with **_rm** not to override other .json files having the same name (in this case, `en.json` and `it.json`) that could be a result of the standard behavior of the reverse process._

## Try It

The `sample` folder contains both .json and .properties fileS to download and test on.