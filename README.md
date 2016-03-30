Data Table Viewer Widget
======================

The Data Table Viewer Widget provides the ability to represent a set of data on a table.

Build
-----

Be sure to have installed [Node.js](http://node.js) in your system. For example, you can install it on Ubuntu and Debian running the following commands:

```bash
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs
sudo apt-get install npm
```

If you want the last version of the operator, you should change to the `develop` branch:

```bash
git checkout develop
```

Install other npm dependencies by running: (need root because some libraries use applications, check package.json before to be sure)

```bash
sudo npm install
```

For build the operator you need download grunt:

```bash
sudo npm install -g grunt-cli
```

And now, you can use grunt:

```bash
grunt
```

If everything goes well, you will find a wgt file in the `dist` folder.

## Settings

- **`Pagination size`**: The number of rows that each page will have. If set to 0 or less, pagination will be disabled.
- **`Search bar`**: Set if the search bar is to be displayed or not.

## Wiring

### Input Endpoints

- **`Data and Structure`**: The input data to be plotted on the table.

### Output Endpoints

- **`Selected Entry`**: The data associated to the chosen row.
- **`Selected Filter`**: The filter settings to get the chosen row.

## Usage

Plug in the data you want to plot on the table and the use the search bar to filter shwon rows, pagination and the scroll bar to navigate the table, and click on a row to select it and send it's data through the wiring.

## Developer usage

To use this widget, the input data must be a JavaScript object with the following data:

- **structure**: Represents the structure of the table. It is an array of columns, each column being:
    - **id**: The id of the column.
    - **label**: The label of the column, this is an optional field, and if not provided, the id will be used. If its an empty string no label will be shown.
    - **type**: The type of the values of that column, accepted types are `"number"`, `"boolean"`, `"string"` and `"date"`.

- **data**: The data to be plotted. It's an array of items that should have at least all the properties defined as IDs in the structure. If the input data has more properties, those properties won't be plotted but will be passed through the **`Selected Entry`** endpoint. 

- **id**: The propertie of the data to be used as row ID, this propertie must be unique for the row selection to work. This property is optional and if omitted, the first column of the table will be used as ID.

- **state_function**: A function to calculate the state of each row, this is, the color it will get. This function takes as an argument a row (an item of the data array), and should return `"success"`, `"warning"`, `"danger"`, `"info"` or `null`. For the state function to work, data can't be on a JSON, since functions dont get parsed. This property is optional, and if omitted the table won't be colored.

Example input:

```javascript
dataset = {
    "structure": [ {"id": "name", "label": "Username","type": "string"}, {"id": "age", "label": "Age","type": "number"} ],
    "data": [ {"name": "Bart", "age": 29 }, {"name": "Lisa", "date": 7 }],
    "state_function" : function (entry) {entry.age >= 18 ? return "success" : return "danger"}
}
```

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)

## Copyright and License

Copyright (c) 2016 Conwet
