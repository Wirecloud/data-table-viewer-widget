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

## Reference

- [FIWARE Mashup](https://mashup.lab.fiware.org/)