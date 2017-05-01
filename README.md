# json-to-properties

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

## Try It

The `sample` folder contains both .json and .properties fileS to download and test on.