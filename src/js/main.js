/*
 * Copyright (c) 2014-2016 CoNWeT Lab., Universidad Politécnica de Madrid
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* globals StyledElements */

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

        // Create the search filter only if its enabled
        var bool = JSON.parse(MashupPlatform.prefs.get("search"));
        if (bool) {
            createFilter.call(this);
        }
        this.layout.repaint();
    };

    /** ************************************************************************/
    /** **************************** AUXILIAR **********************************/
    /** ************************************************************************/

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
        var textInput = new StyledElements.TextField({placeholder: 'Filter'});
        textInput.addEventListener('submit', filter.bind(this));
        southLayout.getCenterContainer().appendChild(textInput);
        searchAddon.assignInput(textInput);

        // Set search button
        var search_button = new StyledElements.Button({
            text: 'Search'
        });
        search_button.addEventListener('click', filter.bind(this));
        southLayout.getEastContainer().appendChild(search_button);
    };

    /** ************************************************************************/
    /** **************************** HANDLERS **********************************/
    /** ************************************************************************/

    var handlerDataSet = function handlerSlotIssue(datasetString) {
        /*  dataset = {
         *      "structure": [ {"id": "pk", "label": "Primary Key,"type": "number"}, ... ],
         *      "data": [ {"pk": "", ...}, ...],
         *      "id": pk,
         *      "state_function" : function (entry) {...}, //RETURNS "success"(green), "danger"(red), or nothing (non-colored).
         *      "selectionType" : "single"
         *  }
         */

        // Remove the previuos table
        this.layout.getCenterContainer().clear();

        /* Parse the dataset (if it's a JSON).
         * This is done to allow both kinds of input (JSON or non-JSON), since functions are required for the table to display the state of the row, and functions can't be parsed into a JSON string.
         */
        var dataset;
        if (typeof (datasetString) === "string") {
            dataset = JSON.parse(datasetString);
        } else {
            dataset = datasetString;
        }

        // Set the data and the structure
        this.data = dataset.data;
        this.structure = dataset.structure;
        this.id = dataset.id || dataset.structure[0].id;

        this.structure.forEach(function (column) {
            if ('id' in column && !('field' in column)) {
                column.field = column.id;
            }
        });

        // The table configuration
        var pageSize = MashupPlatform.prefs.get("pagination");
        pageSize = pageSize > 0 ? pageSize : 0;
        var options = {
            id: this.id,
            pageSize: pageSize,
            class: 'table-striped',
            stateFunc: dataset.state_function,
            selectionType: dataset.selectionType || "none"
        };

        // Create the table
        this.table = new StyledElements.ModelTable(this.structure, options);

        try {
            this.table.addEventListener("select", function (_, selection) {
                MashupPlatform.wiring.pushEvent('selected-entry', buildSelectedRows(this.data, selection, this.id));
            }.bind(this));
        } catch (err) {
            MashupPlatform.widget.log("Row selection is disabled. Update Wirecloud to enable it.", MashupPlatform.log.INFO);
        }

        this.table.source.changeElements(this.data);
        this.layout.getCenterContainer().appendChild(this.table);

        // Repaint the layout
        this.layout.repaint();
    };

    // Get the row list from the id list
    var buildSelectedRows = function buildSelectedRows(data, selectedIds, idRef) {
        var result = [];

        var aux = data.map(function (e) {
            return e[idRef];
        });

        selectedIds.forEach(function (id) {
            var i = aux.indexOf(id);
            if (i !== -1) {
                result.push(data[i]);
            }
        });

        return result;
    };

    var data_viewer = new DataViewer();
    window.addEventListener("DOMContentLoaded", data_viewer.init.bind(data_viewer), false);

})();
