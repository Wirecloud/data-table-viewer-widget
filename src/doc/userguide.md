## Introduction

The Data Table Viewer Widget provides the ability to represent a set of data on a table.

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
    - **field / id**: The property of the data to be displayed on the column.
    - **type**: The type of the values of that column, accepted types are `"number"`, `"boolean"`, `"string"` and `"date"`.
    - **label**: The label of the column, and if not provided, the id will be used. If its an empty string no label will be shown. This is an optional property.
    - **sortable**: If the column is sortable. By default is true. This is an optional property.
    - **width**: The width of the column. This is an optional property.
    - **unit**: The unit to be displayed for a value. Its only used if the column type is `"number"`. This is an optional property.
    - **dateparser**: Function to be used to parse dates. It takes one argument, which will be the date, and must return a `Date` object. By default the JavaScript date parser will be used (`Date`). This is an optional property.
    - **sort_id**: The property to be used to filter the column. By default its the same property used on the field property. This is an optional property.
    - **contentBuilder**: Function to be used to get the content of a cell based on the input item. This function takes as input an item() and must return the string to be displayed on the current cell. This is an optional property and by default it will take the `data[field]` value.

- **data**: The data to be plotted. It's an array of items that should have at least all the properties defined as IDs in the structure. If the input data has more properties, those properties won't be plotted but will be passed through the **`Selected Entry`** endpoint. 

- **id**: The property of the data to be used as row ID, this property must be unique for the row selection to work. This property is optional and if omitted, the first column of the table will be used as ID.

- **state_function**: A function to calculate the state of each row, this is, the color it will get. This function takes as an argument a row (an item of the data array), and should return `"success"`, `"warning"`, `"danger"`, `"info"` or `null`. For the state function to work, data can't be on a JSON, since functions dont get parsed. This property is optional, and if omitted the table won't be colored.

Example input:

```javascript
dataset = {
    "structure": [ {"id": "name", "label": "Username","type": "string"}, {"id": "age", "label": "Age","type": "number"} ],
    "data": [ {"name": "Bart", "age": 29 }, {"name": "Lisa", "date": 7 }],
    "state_function" : function (entry) {entry.age >= 18 ? return "success" : return "danger"}
}
```