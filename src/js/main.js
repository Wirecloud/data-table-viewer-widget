/*
 *     Copyright (c) 2014 - 2016 CoNWeT Lab., Universidad Politécnica de Madrid
 *
 */
/* global StyledElements */

(function () {

    "use strict";

    var DataViewer = function () {
        /* Input endpoints */
        MashupPlatform.wiring.registerCallback("dataset", handlerDataSet.bind(this));

        /* Context */
        MashupPlatform.widget.context.registerCallback(function (newValues) {
            if (this.layout && ("heightInPixels" in newValues || "widthInPixels" in newValues)) {
                this.layout.repaint();
            }
        }.bind(this));

        this.layout = null;
        this.table = null;

        this.structure = [];        // [ {"id":"pk"} , {"id": "name"}, ...]
        this.data = [];             // [ {"id":"2", "name":"test"}, {"id":"3", "name": "test2"}, ...]
    };

    DataViewer.prototype.init = function init() {
        this.layout = new StyledElements.BorderLayout();
        this.layout.insertInto(document.body);
        createFilter.call(this);
        this.layout.repaint();
    };

    /**************************************************************************/
    /****************************** AUXILIAR **********************************/
    /**************************************************************************/

    var createFilter = function createFilter() {
        var southLayoutOptions = {
            'class': 'input input-prepend input-append'
        };
        var southLayout = new StyledElements.HorizontalLayout(southLayoutOptions);

        this.layout.getSouthContainer().appendChild(southLayout);

        // Function to be call when the user clicks on "search" or types "enter"
        var filter = function filter() {
            this.table.source.changeOptions({'keywords': textInput.getValue()});
        };

        var searchAddon = new StyledElements.Addon({'title': 'Search'});
        southLayout.getWestContainer().appendChild(searchAddon);

        // Set search icon
        var searchIcon = document.createElement('i');
        searchIcon.className = 'icon-search';
        searchAddon.appendChild(searchIcon);

        // Set input field
        var textInput = new StyledElements.StyledTextField({placeholder: 'Filter'});
        textInput.addEventListener('submit', filter.bind(this));
        southLayout.getCenterContainer().appendChild(textInput);
        searchAddon.assignInput(textInput);

        // Set search button
        var search_button = new StyledElements.StyledButton({
            text: 'Search'
        });
        search_button.addEventListener('click', filter.bind(this));
        southLayout.getEastContainer().appendChild(search_button);
    };

    /**************************************************************************/
    /****************************** HANDLERS **********************************/
    /**************************************************************************/

    var handlerDataSet = function handlerSlotIssue(datasetString) {
        /*  dataset = {
         *      "structure": [ {"id": "pk", "type": "number"}, ... ],
         *      "data": [ {"pk": "", ...}, ...],
         *      "id": pk,
         *  }
         */

        // Remove the previuos table
        this.layout.getCenterContainer().clear();

        // Parse the dataset
        var dataset = JSON.parse(datasetString);

        // Set the data and the structure
        this.data = dataset.data;
        this.structure = dataset.structure;
        this.id = dataset.id || dataset.structure[0].id;

        // Create the table
        var columns = [];
        for (var i = 0; i < this.structure.length; i++) {
            //Accepted types: number, boolean, string, date
            columns.push({field: this.structure[i].id, label: this.structure[i].id, sortable: true, type: this.structure[i].type});
        }

        this.table = new StyledElements.ModelTable(columns, {id: this.id, pageSize: 10});
        this.table.addEventListener("click", onRowClick.bind(this));
        this.table.source.changeElements(this.data);
        this.layout.getCenterContainer().appendChild(this.table);

        // Repaint the layout
        this.layout.repaint();
    };

    //Row selection
    var onRowClick = function onRowClick(row) {
        //Clear selection
        if (this.table.selection.length > 0 && this.table.selection[0] === row[this.id]) {
            this.table.select();
            MashupPlatform.wiring.pushEvent('condition-list', []);
            MashupPlatform.wiring.pushEvent('selected-entry', null);
        } else {
            //New selection
            this.table.select(row[this.id]);
            MashupPlatform.wiring.pushEvent('condition-list', [{type: 'eq', attr: this.id, value: row[this.id]}]);
            MashupPlatform.wiring.pushEvent('selected-entry', row);
        }
    };


    var data_viewer = new DataViewer();
    window.addEventListener("DOMContentLoaded", data_viewer.init.bind(data_viewer), false);

})();
