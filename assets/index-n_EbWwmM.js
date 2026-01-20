var editor;
var selectedNodeId = null;
var currentRobberyId = null;
var NodeSchemas = {};
var FlatNodeSchemas = {};
var Locales = {};
var GlobalRobberyList = []; 
var editingFieldId = null; 
var coordTargetNodeId = null;

var SkillConfig = {};
var PlayerSkills = { points: 0, skills: [] };
var CurrentTreeId = null;
let st_isPanning = false;
let st_startX = 0;
let st_startY = 0;
let st_translateX = 0;
let st_translateY = 0;
let st_scale = 1;

var SkillKeys = []; 
var CurrentTreeIndex = 0;

var LastUnlockedNodeId = null;

window.addEventListener('message', function(event) {
    const action = event.data.action;
    if (action === 'openEditor') {
        if(event.data.config) {
            NodeSchemas = event.data.config.schemas;
            Locales = event.data.config.locales;
            FlatNodeSchemas = {};
            const firstKey = Object.keys(NodeSchemas)[0];
            if (NodeSchemas[firstKey] && NodeSchemas[firstKey].title) {
                FlatNodeSchemas = NodeSchemas;
            } else {
                for (const [category, nodes] of Object.entries(NodeSchemas)) {
                    for (const [key, schema] of Object.entries(nodes)) {
                        FlatNodeSchemas[key] = schema;
                    }
                }
            }

            applyTranslations();
            generatePalette();
        }
        $('#container').removeClass('hidden');
        changePage('home');
    }  else if (action === 'closeEditor') {
        // $('#container').addClass('hidden');
    } else if (action === 'updateRobberyList') {
        GlobalRobberyList = event.data.list;
        renderRobberyList(event.data.list);
    } else if (action === 'finishCoordSelection') {
        $('#container').removeClass('hidden'); 
        if (editingFieldId && coordTargetNodeId) {
            const coords = event.data.coords;
            let node = editor.getNodeFromId(coordTargetNodeId);
            if (node) {
                let newData = JSON.parse(JSON.stringify(node.data));
                newData[editingFieldId] = coords;
                editor.updateNodeDataFromId(coordTargetNodeId, newData);
                if (selectedNodeId == coordTargetNodeId) {
                    let displayStr = `${coords.x.toFixed(2)}, ${coords.y.toFixed(2)}, ${coords.z.toFixed(2)}`;
                    if (coords.w !== undefined) displayStr += ` | H: ${Math.floor(coords.w)}°`;
                    $(`#coord-display-${editingFieldId}`).val(displayStr);
                }
                notify(Locales.notifications.coords_fetched);
            }
        }
        editingFieldId = null;
        coordTargetNodeId = null;
    } else if (action === 'cancelCoordSelection') {
        $('#container').removeClass('hidden');
        editingFieldId = null;
        coordTargetNodeId = null;
    } else if (action === 'showTextUI') {
        showTextUI(event.data);
    } else if (action === 'hideTextUI') {
        hideTextUI();
    } else if (action === 'openSkillTree') {
        if (event.data.locales) {
            Locales = event.data.locales; 
        }

        SkillConfig = event.data.config;
        PlayerSkills = event.data.playerData;

        applySkillTreeTranslations();

        $('#skill-ui-container').removeClass('hidden');

        SkillKeys = Object.keys(SkillConfig);
        CurrentTreeIndex = 0; 

        if (SkillKeys.length > 1) {
            $('.skill-nav-arrow').fadeIn();
        } else {
            $('.skill-nav-arrow').hide();
        }

        if (SkillKeys.length > 0) {
            selectSkillTree(SkillKeys[0]);
        }
        
        updatePointsDisplay();
    } 
    else if (action === 'updateSkillData') {
        PlayerSkills = event.data.playerData;
        updatePointsDisplay();
        if (CurrentTreeId) renderTreeNodes(CurrentTreeId);
    }
});

function applyTranslations() {
    if(!Locales) return;
    $('#lbl-dashboard-editor').text(Locales.sidebar.dashboard);
    $('#lbl-list-editor').text(Locales.sidebar.list);

    $('#lbl-title-suffix').text(Locales.sidebar.title_suffix);
    $('#lbl-dashboard').text(Locales.sidebar.dashboard);
    $('#lbl-list').text(Locales.sidebar.list);
    $('#lbl-close').text(Locales.sidebar.close);
    $('#lbl-status-title').text(Locales.dashboard.title);
    $('#lbl-welcome-title').text(Locales.dashboard.welcome_title);
    $('#lbl-welcome-desc').text(Locales.dashboard.welcome_desc);
    $('#lbl-stat-active').text(Locales.dashboard.stat_active);
    $('#lbl-db-title').text(Locales.list.title);
    $('#lbl-btn-new').text(Locales.list.new_btn);
    $('#lbl-btn-save').text(Locales.editor.save_btn);
    $('#lbl-btn-import').text(Locales.editor.import_btn);
    $('#lbl-btn-export').text(Locales.editor.export_btn);
    $('#lbl-btn-delete-node').text(Locales.editor.delete_node_btn);
    $('#palette-search').attr('placeholder', Locales.editor.search_placeholder);
    $('#io-cancel-btn').text(Locales.editor.cancel_btn );
}

function applySkillTreeTranslations() {
    if (!Locales || !Locales.skilltree) return;

    const txt = Locales.skilltree;
    $('#lbl-st-prefix').text(txt.title_prefix);
    $('#lbl-st-suffix').text(txt.title_suffix);
    $('#lbl-st-points-label').text(txt.points_label);
    $('#current-tree-title').text(txt.select_category_title);
    $('#current-tree-desc').text(txt.select_category_desc);
}

function resetTreeView() {
    st_translateX = -300; 
    st_translateY = -200;
    st_scale = 1;
    updateTreeTransform();
}

function updateTreeTransform() {
    const layer = document.getElementById('tree-nodes-layer');
    if(layer) {
        layer.style.transform = `translate(${st_translateX}px, ${st_translateY}px) scale(${st_scale})`;
    }
}

$(document).ready(function() {
    const container = document.getElementById('tree-canvas-container');

    container.addEventListener('wheel', function(e) {
        e.preventDefault();

        const zoomSpeed = 0.001;
        const newScale = st_scale + (e.deltaY * -zoomSpeed);
        st_scale = Math.min(Math.max(0.5, newScale), 2.0);

        updateTreeTransform();
    }, { passive: false });

    container.addEventListener('mousedown', function(e) {
        if (e.button !== 0 && e.button !== 1) return;

        st_isPanning = true;
        st_startX = e.clientX - st_translateX;
        st_startY = e.clientY - st_translateY;
        
        $('#tree-canvas-container').css('cursor', 'grabbing');
    });

    window.addEventListener('mousemove', function(e) {
        if (!st_isPanning) return;
        if ($('#skill-ui-container').hasClass('hidden')) return;

        e.preventDefault();
        
        st_translateX = e.clientX - st_startX;
        st_translateY = e.clientY - st_startY;

        updateTreeTransform();
    });

    window.addEventListener('mouseup', function() {
        if (st_isPanning) {
            st_isPanning = false;
            $('#tree-canvas-container').css('cursor', 'grab');
        }
    });
});

function closeSkillUI() {
    $('#skill-ui-container').addClass('hidden');
    $.post(`https://${GetParentResourceName()}/closeSkillTree`, JSON.stringify({}));
}

function updatePointsDisplay() {
    $('#skill-points-val').text(PlayerSkills.points);
}

function selectSkillTree(treeId) {
    CurrentTreeId = treeId;
    const treeData = SkillConfig[treeId];

    $(`#cat-btn-${treeId}`).addClass('active');
    
    $('#current-tree-title').text(treeData.title);
    $('#current-tree-desc').text(treeData.description);

    renderTreeNodes(treeId);
    resetTreeView();
}

function renderTreeNodes(treeId) {
    const treeData = SkillConfig[treeId];
    const nodesLayer = $('#tree-nodes-layer');
    nodesLayer.empty();

    const nodes = treeData.nodes;
    const txt = Locales.skilltree.status;

    nodes.forEach(node => {
        const isUnlocked = PlayerSkills.skills.includes(node.id);
        const canUnlock = checkRequirements(node, PlayerSkills.skills);
        
        let statusClass = 'locked';
        let statusText = `<i class="fa-solid fa-lock"></i> ${txt.locked}`;
        let animClass = '';

        if (isUnlocked) {
            statusClass = 'unlocked';
            statusText = `<i class="fa-solid fa-check"></i> ${txt.unlocked}`;

            if (LastUnlockedNodeId === node.id) {
                animClass = 'just-unlocked';
                setTimeout(() => { LastUnlockedNodeId = null; }, 1000);
            }

        } else if (canUnlock) {
            statusClass = 'available';
            statusText = `
                <div style="font-weight:bold; color:var(--c-yellow); margin-bottom:4px;">
                    ${txt.cost}: ${node.cost} ${txt.points_short}
                </div>
                <div style="font-size:0.75rem; opacity:0.8;">
                    ${node.desc || txt.click_to_unlock}
                </div>
            `;
        } else {
            statusText = `
                <div style="font-size:0.75rem;">${txt.req_prev}</div>
            `;
        }

        const html = `
            <div class="skill-node ${statusClass} ${animClass}" 
                 id="node-${node.id}" 
                 style="grid-row: ${node.row}; grid-column: ${node.col};"
                 onclick="handleNodeClick('${treeId}', '${node.id}', ${node.cost}, '${statusClass}')">
                
                <div class="skill-title-box">
                    <i class="fa-solid ${node.icon || 'fa-star'}"></i> ${node.label}
                </div>
                
                <div class="skill-content-box">
                    ${statusText}
                </div>
            </div>
        `;
        nodesLayer.append(html);
    });
}

function checkRequirements(node, unlockedSkills) {
    if (!node.req) return true;
    
    if (Array.isArray(node.req)) {
        return node.req.every(reqId => unlockedSkills.includes(reqId));
    } else {
        return unlockedSkills.includes(node.req);
    }
}

function handleNodeClick(treeId, nodeId, cost, status) {
    const txt = Locales.skilltree.notifications;

    if (status === 'locked') {
        notify(txt.req_failed); 
        return;
    }
  
    if (status === 'unlocked') return;

    if (PlayerSkills.points >= cost) {
        LastUnlockedNodeId = nodeId;
        $.post(`https://${GetParentResourceName()}/unlockSkill`, JSON.stringify({
            treeId: treeId,
            skillId: nodeId,
            cost: cost
        }));

    } else {
        notify(txt.no_points);
    }
}

function generatePalette() {
    const container = $('#palette-container');
    container.html(''); 

    const isCategorized = Object.keys(NodeSchemas).length > 0 && !NodeSchemas[Object.keys(NodeSchemas)[0]].title;

    if (!isCategorized) {
        const keys = Object.keys(NodeSchemas);
        keys.sort((a, b) => NodeSchemas[a].title.toLowerCase().localeCompare(NodeSchemas[b].title.toLowerCase()));
        keys.forEach(key => {
            const schema = NodeSchemas[key];
            container.append(`
                <div class="palette-item" onclick="addNodeToViewCenter('${key}')">
                    <i class="fa-solid ${schema.icon || 'fa-cube'}"></i> ${schema.title}
                </div>
            `);
        });
    } else {
        const categories = Object.keys(NodeSchemas).sort();

        categories.forEach((catName, index) => {
            const nodesObj = NodeSchemas[catName];
            const nodeKeys = Object.keys(nodesObj).sort((a, b) => nodesObj[a].title.toLowerCase().localeCompare(nodesObj[b].title.toLowerCase()));

            let itemsHtml = '';
            nodeKeys.forEach(key => {
                const schema = nodesObj[key];
                itemsHtml += `
                    <div class="palette-item" onclick="addNodeToViewCenter('${key}')">
                        <i class="fa-solid ${schema.icon || 'fa-cube'}"></i> ${schema.title}
                    </div>
                `;
            });

            const isOpen = '';

            const categoryHtml = `
                <div class="palette-category ${isOpen}">
                    <div class="palette-category-header" onclick="$(this).parent().toggleClass('open')">
                        <span>${catName}</span>
                        <i class="fa-solid fa-chevron-down arrow"></i>
                    </div>
                    <div class="palette-category-content">
                        <div class="palette-category-inner">
                            ${itemsHtml}
                        </div>
                    </div>
                </div>
            `;
            container.append(categoryHtml);
        });
    }
}

function notify(msg) {
    $.post(`https://${GetParentResourceName()}/notify`, JSON.stringify({ msg: msg }));
}

function closeEditor() {
    // $.post(`https://${GetParentResourceName()}/closeEditor`, JSON.stringify({}));
}

window.changePage = function(pageId) {
    $('.content').addClass('hidden');
    $('#page-' + pageId).removeClass('hidden');
    $('.nav-btn').removeClass('active');
    
    if (pageId === 'home') {
        $('#nav-btn-home').addClass('active');
        $('#mainNavigation').show();
    } 
    else if (pageId === 'list') {
        $('#nav-btn-list').addClass('active');
        $('#mainNavigation').show(); 
        // $.post(`https://${GetParentResourceName()}/getRobberyList`, JSON.stringify({}));
    } 
    else if (pageId === 'editor') {
        $('#mainNavigation').hide();
    }
}

function renderRobberyList(robberies) {
    const container = $('#robbery-list-container');
    container.empty();
    $('#total-heists').text(robberies.length);
    if (robberies.length === 0) {
        container.html(`<div class="empty-state" style="grid-column: 1 / -1;"><i class="fa-solid fa-box-open"></i><h3>${Locales.list.empty_state_title}</h3><p>${Locales.list.empty_state_desc}</p></div>`);
        return;
    }
    robberies.forEach(robbery => {
        let details = `ID: ${robbery.id}`;
        container.append(`
        <div class="list-item">
            <div class="list-item-icon"><i class="fa-solid fa-building-columns"></i></div>
            <div class="list-item-title">${robbery.name}</div>
            <div class="list-item-desc">[ ${details} ]</div>
            <div class="action-buttons">
                <button class="action-btn edit-btn" onclick="editRobbery(${robbery.id})"><i class="fa-solid fa-pen"></i> ${Locales.list.edit_btn}</button>
                <button class="action-btn danger" onclick="deleteRobbery(${robbery.id})"><i class="fa-solid fa-trash"></i> ${Locales.list.del_btn}</button>
            </div>
        </div>`);
    });
}
window.deleteRobbery = function(id) {
    // $.post(`https://${GetParentResourceName()}/deleteRobbery`, JSON.stringify({ id: id }));
}

function resetDrawflowContainer() {
    const parent = $('#drawflow').parent();
    $('#drawflow').remove();
    parent.append('<div id="drawflow"></div>');
}

window.createNewRobbery = function() {
    currentRobberyId = null;
    const inputHtml = `<input type="text" id="heist-name-input" value="New Heist" style="background:transparent; border:none; border-bottom:1px solid var(--glow-green); color:var(--glow-green); font-size:1.2rem; font-weight:600; text-transform:uppercase; outline:none; width:300px;">`;
    $('#editor-title').html(inputHtml);
    
    changePage('editor');
    setTimeout(() => { resetDrawflowContainer(); initDrawflow(null); }, 50);
}

window.editRobbery = function(id) {
    const robbery = GlobalRobberyList.find(r => r.id === id);
    if (!robbery) return;
    currentRobberyId = id;

    const inputHtml = `<input type="text" id="heist-name-input" value="${robbery.name}" style="background:transparent; border:none; border-bottom:1px solid var(--glow-green); color:var(--glow-green); font-size:1.2rem; font-weight:600; text-transform:uppercase; outline:none; width:300px;">`;
    $('#editor-title').html(inputHtml);
    
    changePage('editor');
    setTimeout(() => { resetDrawflowContainer(); initDrawflow(JSON.parse(robbery.data).graph); }, 50);
}

function initDrawflow(importData) {
    var id = document.getElementById("drawflow");
    if(!id) return;
    editor = new Drawflow(id);
    editor.reroute = true;
    editor.editor_mode = 'edit';
    editor.zoom_max = 1.6; editor.zoom_min = 0.5; editor.zoom_value = 0.1;
    editor.start();

    editor.container.addEventListener('wheel', function(e) {
        if(e.deltaY > 0) editor.zoom_out(); else editor.zoom_in();
        e.preventDefault(); e.stopPropagation();
    }, { passive: false });

    editor.on('nodeSelected', function(id) {
        closeProperties();
        setTimeout(() => {
            selectedNodeId = id;
            try { const node = editor.getNodeFromId(id); if(node) openProperties(node); } catch(e) { console.error(e); }
        }, 10);
    });
    editor.on('nodeUnselected', () => { selectedNodeId = null; });
    editor.on('connectionSelected', (conn) => { editor.removeSingleConnection(conn.output_id, conn.input_id, conn.output_class, conn.input_class); });

    if (importData) { try { editor.import(importData); } catch(e) { console.error(e); } }
}

window.addNodeToViewCenter = function(type) {
    createNodeLogic(type, (editor.precanvas.clientWidth / 2 - editor.canvas_x) / editor.zoom, (editor.precanvas.clientHeight / 2 - editor.canvas_y) / editor.zoom);
}

function createNodeLogic(type, pos_x, pos_y) {
    const schema = FlatNodeSchemas[type]; 
    
    if (!schema) {
        console.error("Schema not found for type:", type);
        return;
    }

    let defaultData = {};
    if (schema.fields) {
        schema.fields.forEach(f => defaultData[f.id] = f.default);
    }

    var html = `<div class="title-box"><i class="fa-solid ${schema.icon || 'fa-cube'}"></i> ${schema.title}</div><div class="content-box">${Locales.editor.click_to_edit}</div>`;

    editor.addNode(type, 1, schema.doubleOption ? 2 : 1, pos_x, pos_y, type, defaultData, html);
}

function openProperties(node) {
    const type = node.name;
    let data = JSON.parse(JSON.stringify(node.data)); 
    const schema = FlatNodeSchemas[type];
    
    if (!schema) return;

    if (type === 'showtarget') {
        const allNodes = editor.export().drawflow.Home.data;
        const targetOptions = [];
        for (const id in allNodes) {
            const n = allNodes[id];
            if (id != node.id && n.name === 'target') {
                const targetSchema = FlatNodeSchemas[n.name];
                let label = n.data.msg || (targetSchema ? targetSchema.title : n.name);
                targetOptions.push({ value: id, label: `${label} (ID: ${id})` });
            }
        }
        const field = schema.fields.find(f => f.id === 'targetNodeId');
        if (field) field.dynamicOptions = targetOptions;
    }

    selectedNodeId = node.id; 
    const propsContainer = $('#props-content');
    propsContainer.empty();
    $('#props-title').text(schema.title + " (ID: " + node.id + ")");

    let dataWasUpdated = false;

    if (schema.fields) {
        schema.fields.forEach(field => {
            let val = data[field.id];
            if (val === undefined && field.default !== undefined) {
                val = field.default;
                data[field.id] = val;
                dataWasUpdated = true;
            }

            if (field.type === 'select' && val === undefined) {
                const opts = field.dynamicOptions || field.options || [];
                if (opts.length > 0) {
                    const firstOpt = opts[0];
                    val = typeof firstOpt === 'object' ? firstOpt.value : firstOpt;
                    data[field.id] = val;
                    dataWasUpdated = true;
                }
            }

            let fieldUniqueId = `node-${node.id}-field-${field.id}`;
            let html = `<div class="prop-group"><label>${field.label}</label>`;

            if (field.type === 'text' || field.type === 'number') {
                let safeVal = (val !== undefined && val !== null) ? val : '';
                html += `<input type="${field.type}" id="${fieldUniqueId}" value="${safeVal}" oninput="updateNodeData('${field.id}', this.value)">`;
            } 
            else if (field.type === 'select') {
                html += `<select id="${fieldUniqueId}" onchange="updateNodeData('${field.id}', this.value)">`;
                (field.dynamicOptions || field.options || []).forEach(opt => {
                    let optVal = typeof opt === 'object' ? opt.value : opt;
                    let optLab = typeof opt === 'object' ? opt.label : opt;
                    let isSelected = (optVal == val) ? 'selected' : '';
                    
                    html += `<option value="${optVal}" ${isSelected}>${optLab}</option>`;
                });
                html += `</select>`;
            } 
            else if (field.type === 'coords_btn') {
                let displayVal = val && val.x ? `${val.x.toFixed(2)}, ${val.y.toFixed(2)}, ${val.z.toFixed(2)}` + (val.w ? ` | H: ${Math.floor(val.w)}°` : '') : '';
                html += `<div style="display:flex; gap:5px;"><input type="text" readonly value="${displayVal}" id="coord-display-${field.id}" placeholder="---"><button class="action-btn primary" style="padding:0.6rem;" onclick="fetchCoordsForProp('${field.id}')"><i class="fa-solid fa-crosshairs"></i></button></div>`;
            }
            html += `</div>`;
            propsContainer.append(html);
        });
    }

    if (dataWasUpdated) {
        editor.updateNodeDataFromId(node.id, data);
    }

    if (type === 'showtarget' && data.targetNodeId) highlightRemoteNode(data.targetNodeId);
    $('#properties-panel').addClass('open');
}

window.fetchCoordsForProp = function(fieldId) {
    if (!selectedNodeId) return;
    let node = editor.getNodeFromId(selectedNodeId);
    // let schema = FlatNodeSchemas[node.name];
    
    editingFieldId = fieldId;
    coordTargetNodeId = selectedNodeId;
    
    // $('#container').addClass('hidden');

    // let customModel = node.data.model;

    // $.post(`https://${GetParentResourceName()}/startCoordSelection`, JSON.stringify({
    //     nodeName: node.name || null,
    //     showNPC: schema.showNPC || false,
    //     showProp: schema.isCustomProp ? true : schema.showProp, 
    //     showCar: schema.showCar || false,
    //     isCustomProp: schema.isCustomProp || false, 
    //     selectEntity: schema.selectEntity || null, 
    //     showPedMinigamePreview: schema.showPedMinigamePreview  || null, 
    //     model: customModel || schema.showProp || 'prop_box_pile_01'
    // }));
}

window.closeProperties = function() {
    $('#properties-panel').removeClass('open');
    $('.drawflow-node').removeClass('highlight-remote');
}

window.updateNodeData = function(key, value) {
    if (!selectedNodeId) return;
    let node = editor.getNodeFromId(selectedNodeId);
    if (!node) return;
    let currentData = {...node.data};
    if(!isNaN(value) && value !== '' && typeof value !== 'boolean') value = parseFloat(value);
    currentData[key] = value;
    editor.updateNodeDataFromId(selectedNodeId, currentData);
    if (key === 'targetNodeId') highlightRemoteNode(value);
}

window.highlightRemoteNode = function(nodeId) {
    $('.drawflow-node').removeClass('highlight-remote');
    if (!nodeId) return;
    $(`#node-${nodeId}`).addClass('highlight-remote');
}

window.deleteSelectedNode = function() {
    if (selectedNodeId) { editor.removeNodeId('node-' + selectedNodeId); closeProperties(); }
}


window.saveGraph = function() {
    var exportData = editor.export();
    const nodes = exportData.drawflow.Home.data;
    let firstRootNode = null;
    for (const id in nodes) {
        let node = nodes[id];
        let hasInputs = node.inputs.input_1 && node.inputs.input_1.connections.length > 0;
        if (!hasInputs && node.data.coords) { firstRootNode = node; break; }
    }
    if (!firstRootNode) { notify(Locales.notifications.need); return; }

    let nameInput = $('#heist-name-input').val();
    let heistName = nameInput && nameInput.trim() !== "" ? nameInput.trim() : "New Heist";
    
    const setupData = { name: heistName, coords: firstRootNode.data.coords, radius: firstRootNode.data.radius || 2.0, targetLabel: firstRootNode.data.msg || "Start" };
    // $.post(`https://${GetParentResourceName()}/saveRobbery`, JSON.stringify({ id: currentRobberyId, setup: setupData, graph: exportData }));
    changePage('list'); 
}

$('#palette-search').on('keyup', function() {
    let value = $(this).val().toLowerCase().trim();
    const categories = $('.palette-category');
    const flatItems = $('#palette-container > .palette-item');

    if (flatItems.length > 0) {
        flatItems.each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggleClass('hidden-search', !text.includes(value));
        });
        return;
    }

    if (categories.length > 0) {
        categories.each(function() {
            let category = $(this);
            let hasVisibleItems = false;
            let items = category.find('.palette-item');
            
            items.each(function() {
                const item = $(this);
                const text = item.text().toLowerCase();
                const matches = text.includes(value);
                
                item.toggleClass('hidden-search', !matches);
                if (matches) hasVisibleItems = true;
            });

            if (value === "") {
                category.removeClass('hidden-search');
                category.removeClass('open'); 
                if (category.is(':first-child')) category.addClass('open');
            } else {
                if (hasVisibleItems) {
                    category.removeClass('hidden-search');
                    category.addClass('open'); 
                } else {
                    category.addClass('hidden-search');
                    category.removeClass('open');
                }
            }
        });
    }
});

let currentIOMode = null; 

window.exportGraph = function() {
    const data = editor.export();
    const jsonString = JSON.stringify(data);
    
    currentIOMode = 'export';

    $('#io-modal-title').text(Locales.editor.modal_export_title);
    $('#io-modal-desc').text(Locales.editor.modal_export_desc);
    
    $('#io-textarea').val(jsonString).prop('readonly', true);

    const copyText = Locales.editor.btn_copy;
    $('#io-action-btn')
        .html(`<i class="fa-solid fa-copy"></i> <span>${copyText}</span>`)
        .removeClass('secondary btn-success-state')
        .addClass('primary')
        .prop('disabled', false);
    
    $('#io-modal').removeClass('hidden');
    $('#io-textarea').select();
}

window.importGraph = function() {
    currentIOMode = 'import';
 
    $('#io-modal-title').text(Locales.editor.modal_import_title);
    $('#io-modal-desc').text(Locales.editor.modal_import_desc);
    
    $('#io-textarea').val('').prop('readonly', false);

    const loadText = Locales.editor.btn_load;
    $('#io-action-btn')
        .html(`<i class="fa-solid fa-file-import"></i> <span>${loadText}</span>`)
        .removeClass('secondary btn-success-state')
        .addClass('primary')
        .prop('disabled', false);
    
    $('#io-modal').removeClass('hidden');
    setTimeout(() => $('#io-textarea').focus(), 100);
}

window.executeIOAction = function() {
    const btn = $('#io-action-btn');

    if (currentIOMode === 'export') {
        const textarea = document.getElementById('io-textarea');
        textarea.select();
        textarea.setSelectionRange(0, 9999999); 
        
        try {
            const successful = document.execCommand('copy');
            
            if (successful) {
                if (!btn.hasClass('btn-success-state')) {
                    originalBtnContent = btn.html();
                }

                btn.addClass('content-hidden');

                setTimeout(() => {
                    const copiedText = (Locales && Locales.editor && Locales.editor.btn_copied)
                
                    btn.addClass('btn-success-state');
                    btn.html(`<i class="fa-solid fa-check"></i> <span>${copiedText}</span>`);

                    requestAnimationFrame(() => {
                        btn.removeClass('content-hidden');
                    });
                }, 100);

                setTimeout(() => {
                    btn.addClass('content-hidden');
                    setTimeout(() => {
                        btn.removeClass('btn-success-state');
                        
                        btn.html(originalBtnContent);

                        requestAnimationFrame(() => {
                            btn.removeClass('content-hidden');
                        });
                    }, 100);
                }, 2000);

            } else {
                console.error('Fallback copy failed.');
            }
        } catch (err) {
            console.error('Fallback copy error', err);
        }

    } else if (currentIOMode === 'import') {
        const jsonString = $('#io-textarea').val().trim();
        if (!jsonString) return;

        try {
            const data = JSON.parse(jsonString);
            editor.clearModuleSelected(); 
            editor.clear();
            editor.import(data);
            closeIOModal();
        } catch (e) {
            console.error(e);
            $('#io-textarea').css('border-color', 'var(--c-red)');
            setTimeout(() => $('#io-textarea').css('border-color', ''), 2000);
        }
    }
}

window.closeIOModal = function() {
    $('#io-modal').addClass('hidden');
    currentIOMode = null;
    $('#io-action-btn').removeClass('btn-success-state');
}


function showTextUI(data) {
    const container = $('#text-ui-container');
    const titleEl = $('#text-ui-title');
    const msgEl = $('#text-ui-msg');
    const iconEl = $('#text-ui-icon');

    container.removeClass((index, className) => {
        return (className.match(/(^|\s)pos-\S+/g) || []).join(' ');
    });

    let posClass = 'pos-right-center'; 
    switch (data.position) {
        case 'left': posClass = 'pos-left-center'; break;
        case 'right': posClass = 'pos-right-center'; break;
        case 'center': posClass = 'pos-center'; break;
        case 'bottom-left': posClass = 'pos-bottom-left'; break;
        case 'bottom-right': posClass = 'pos-bottom-right'; break;
        case 'top-left': posClass = 'pos-top-left'; break;
        case 'top-right': posClass = 'pos-top-right'; break;
        default: posClass = 'pos-' + data.position; 
    }
    
    container.addClass(posClass);

    titleEl.text(data.title || ""); 
    msgEl.html(data.msg || "");

    iconEl.attr('class', 'fa-solid ' + (data.icon || 'fa-circle-info'));

    container.removeClass('hidden');
}

function hideTextUI() {
    const container = $('#text-ui-container');
    if (container.hasClass('hidden') || container.hasClass('text-ui-exiting')) return;

    container.addClass('text-ui-exiting');

    hideTimeout = setTimeout(() => {
        container.addClass('hidden');
        container.removeClass('text-ui-exiting');
        hideTimeout = null;
    }, 300);
}

function prevSkillTree() {
    if (SkillKeys.length <= 1) return;
    
    CurrentTreeIndex--;
    if (CurrentTreeIndex < 0) {
        CurrentTreeIndex = SkillKeys.length - 1; 
    }
    
    selectSkillTree(SkillKeys[CurrentTreeIndex]);
}

function nextSkillTree() {
    if (SkillKeys.length <= 1) return;

    CurrentTreeIndex++;
    if (CurrentTreeIndex >= SkillKeys.length) {
        CurrentTreeIndex = 0;
    }

    selectSkillTree(SkillKeys[CurrentTreeIndex]);
}

document.onkeyup = function (data) { 
    if (data.which == 27) {
        closeEditor();
        closeSkillUI();
    }
};



















function triggerOpenEditorWithFullData() {
    const config = {
        locales: {
            sidebar: { title_suffix: "OS", dashboard: "Dashboard", list: "Heists", close: "Exit" },
            dashboard: { title: "Status", welcome_title: "Welcome Agent", welcome_desc: "System ready.", stat_active: "Total Heists", stat_version: "Stable", stat_status: "Connected" },
            list: { title: "Database", new_btn: "New Heist", edit_btn: "Edit", del_btn: "DELETE", empty_state_title: "No Heists", empty_state_desc: "Create your first heist." },
            editor: {
                save_btn: "Save and reload", import_btn: "Import", export_btn: "Export", cancel_btn: "Cancel",
                modal_export_title: "EXPORT DATA", modal_export_desc: "Copy the code below to share your setup.",
                modal_import_title: "IMPORT DATA", modal_import_desc: "Paste configuration JSON below.",
                btn_copy: "COPY TO CLIPBOARD", btn_copied: "COPIED", btn_load: "LOAD CONFIGURATION",
                palette_help: "Click to add", properties_title: "Properties", delete_node_btn: "Delete Node",
                start_node_desc: "Entry Point", click_to_edit: "Click to edit", default_heist_prefix: "Heist",
                default_new_suffix: "New", search_placeholder: "Search here..."
            },
            notifications: { start_required: "Start node required!", missing_start_coords: "Start node needs coordinates!", coords_fetched: "Coordinates updated!", need: "Need at least one unlinked node with coords!" },
            miniGames: {
                title_main: "PLUTO", title_sub: "OS", sec: "SEC", status_title: "CONDITION:", waiting: "INITIALIZING...",
                connecting: "CONNECTING: ", success: "CONNECTION ESTABLISHED", fail: "CONNECTION ERROR", win: "SUCCESS", lose: "ACCESS DENIED",
                target: "TARGET SEQ:", invalid_seq: "INVALID SEQUENCE", synchronising: "SYNCHRONIZING...", signal_lost: "SIGNAL LOST (-3s)",
                press_space: "PRESS [MOUSE] TO LOCK", lock_stage: "LOCK", voltage_target: "TARGET", voltage_current: "CURRENT",
                voltage_overflow: "VOLTAGE OVERLOAD", tumbler_correct: "TUMBLER LOCKED"
            },
            skilltree: {
                title_prefix: "SKILL", title_suffix: "TREE", points_label: "AVAILABLE POINTS",
                select_category_title: "SELECT CATEGORY", select_category_desc: "Manage your skills", nodes_count: "nodes",
                status: { locked: "Locked", unlocked: "Unlocked", cost: "COST", points_short: "PTS", click_to_unlock: "Click to unlock", req_prev: "Requires previous skill", req_failed: "Requirements not met", no_points: "Not enough points" }
            }
        },

        schemas: {
            "Actions": {
                'guards': {
                    title: "Spawn NPC Guard", icon: "fa-person-military-rifle", showNPC: true,
                    fields: [
                        { id: 'coords', label: 'Vector (x,y,z)', type: 'coords_btn' },
                        { id: 'model', label: 'Ped Model', type: 'text', default: 's_m_m_security_01' },
                        { id: 'weapon', label: 'Weapon', type: 'text', default: 'WEAPON_PISTOL' },
                        { id: 'amount', label: 'Amount', type: 'number', default: 1 },
                        { id: 'setting_1', label: 'Invinicble', type: 'select', options: ['true', 'false'], default: 'false' },
                        { id: 'setting_2', label: 'Freeze Position', type: 'select', options: ['true', 'false'], default: 'true' },
                        { id: 'dropGuardProp', label: 'Drop prop on ground', type: 'text', default: 'xm3_prop_xm3_pistol_xm3' },
                        { id: 'dropGuardItem', label: 'Reward Item', type: 'text', default: 'WEAPON_PISTOL' },
                        { id: 'count', label: 'Item count', type: 'number', default: 1 },
                        { id: 'msg', label: 'Label', type: 'text', default: 'Take up weapon' },
                        { id: 'icon', label: 'Icon', type: 'text', default: 'fa-solid fa-gun' }
                    ]
                },
                'spawnnpc': {
                    title: "Spawn NPC", icon: "fa-solid fa-person", showNPC: true,
                    fields: [
                        { id: 'coords', label: 'Vector (x,y,z)', type: 'coords_btn' },
                        { id: 'model', label: 'Ped Model', type: 'text', default: 'a_m_m_salton_04' },
                        { id: 'setting_1', label: 'Invinicble', type: 'select', options: ['true', 'false'], default: 'false' },
                        { id: 'setting_2', label: 'Freeze Position', type: 'select', options: ['true', 'false'], default: 'true' },
                        { id: 'addtarget', label: 'Add Target?', type: 'select', options: ['true', 'false'] },
                        { id: 'msg', label: 'Label', type: 'text', default: 'Interact' },
                        { id: 'icon', label: 'Icon', type: 'text', default: 'fa-solid fa-person' },
                        { id: 'cooldown', label: 'Global Cooldown', type: 'number', default: 10 },
                        { id: 'isnetwork', label: 'Network/Local', type: 'select', options: ['local', 'network'], default: 'network' }
                    ]
                },
                'opendoor': { title: "Open Door", icon: "fa-solid fa-door-open", selectEntity: ["door"], fields: [{ id: 'coords', label: 'Select Coords', type: 'coords_btn' }] },
                'drillvault': { title: "Open Vault Door", icon: "fa-solid fa-door-open", selectEntity: ["v_ilev_bk_vaultdoor"], fields: [{ id: 'coords', label: 'Select Coords', type: 'coords_btn' }] },
                'swipecard': { title: "Card Swipe", icon: "fa-solid fa-id-card", showPedMinigamePreview: true, fields: [{ id: 'coords', label: 'Select Coords', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Swipe Card' }, { id: 'item', label: 'Required Item', type: 'text', default: 'access_card' }] },
                'thermalcharge': { title: "Thermal Charge", icon: "fa-solid fa-fire-burner", selectEntity: ["door"], showPedMinigamePreview: true, fields: [{ id: 'coords', label: 'Select Coords', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Melt Lock' }, { id: 'item', label: 'Required Item', type: 'text', default: 'thermite' }] },
                'playanim': { title: "Play Animation", icon: "fa-solid fa-person-walking-arrow-right", fields: [{ id: 'animdict', label: 'Animation Dict', type: 'text', default: 'random@domestic' }, { id: 'animclip', label: 'Animation Clip', type: 'text', default: 'pickup_low' }, { id: 'animduration', label: 'Duration', type: 'number', default: 1800 }] },
                'waitforcombat': { title: "Wait for combat", icon: "fa-solid fa-child-combatant", fields: [{ id: 'coords', label: 'Select Coords', type: 'coords_btn' }, { id: 'radius', label: 'Radius', type: 'number', default: 10 }] }
            },
            "Script Actions": {
                'checkskilltree': { title: "Check required skill", icon: "fa-solid fa-question", doubleOption: true, fields: [{ id: 'skill_id', label: 'Select Required Skill', type: 'select', options: ['hacking_gtav', 'connect_wires', 'find_pattern', 'hack_firewall', 'hack_dial', 'lockpick', 'sum_numbers'], default: 'hacking_gtav' }] },
                'changeskillvalue': { title: "Change skill points", icon: "fa-solid fa-check", fields: [{ id: 'action', label: 'Select Action', type: 'select', options: ['add', 'remove', 'set'], default: 'add' }, { id: 'value', label: 'Value', type: 'number', default: 1 }] },
                'target': {
                    title: "Set Target / Interaction", icon: "fa-solid fa-eye",
                    fields: [
                        { id: 'coords', label: 'Vector (x,y,z)', type: 'coords_btn' },
                        { id: 'radius', label: 'Radius', type: 'number', default: 2.0 },
                        { id: 'players', label: 'Min Players', type: 'select', options: [1, 2, 3, 4], default: 1 },
                        { id: 'msg', label: 'Label', type: 'text', default: 'Interact' },
                        { id: 'icon', label: 'Icon', type: 'text', default: 'fa-solid fa-eye' },
                        { id: 'disappear', label: 'Disappear', type: 'select', options: ['true', 'false'], default: 'true' },
                        { id: 'cooldown', label: 'Global Cooldown', type: 'number', default: 0 }
                    ]
                },
                'showtarget': { title: "Show Hidden Target", icon: "fa-regular fa-eye", fields: [{ id: 'targetNodeId', label: 'Select Target to Show', type: 'select', options: [] }] },
                'wait': { title: "Wait", icon: "fa-solid fa-clock", fields: [{ id: 'wait', label: 'Wait (seconds)', type: 'number', default: 2 }] },
                'teleport': { title: "Teleport", icon: "fa-solid fa-arrows-up-down-left-right", showNPC: true, fields: [{ id: 'coords', label: 'Vector (x,y,z)', type: 'coords_btn' }, { id: 'fadeout', label: 'Fade In/Out', type: 'select', options: ['true', 'false'], default: 'true' }] },
                'explosion': { title: "Explosion", icon: "fa-solid fa-bomb", fields: [{ id: 'coords', label: 'Vector (x,y,z)', type: 'coords_btn' }, { id: 'size', label: 'Size', type: 'select', options: ['small', 'medium', 'big', 'huge'], default: 'medium' }, { id: 'damage', label: 'Do damage?', type: 'select', options: ['true', 'false'], default: 'true' }] },
                'alertpolice': { title: "Alert Police", icon: "fa-solid fa-circle-exclamation", fields: [{ id: 'msg', label: 'Label', type: 'text', default: 'Robbery in progress!' }] },
                'alarm': { title: "Play Alarm", icon: "fa-solid fa-bell", fields: [{ id: 'coords', label: 'Select Coords', type: 'coords_btn' }, { id: 'duration', label: 'Duration', type: 'number', default: 30 }, { id: 'range', label: 'Range', type: 'number', default: 5 }, { id: 'alarmtype', label: 'Type', type: 'text', default: 'ALARMS_KLAXON_03_FAR' }] },
                'notification': { title: "Notify", icon: "fa-regular fa-bell", fields: [{ id: 'title', label: 'Title', type: 'text' }, { id: 'msg', label: 'Label', type: 'text' }] },
                'randomize': { title: "Randomize", icon: "fa-solid fa-shuffle", fields: [] },
                'waypoint': { title: "Set Waypoint", icon: "fa-solid fa-location-dot", fields: [{ id: 'coords', label: 'Select Coords', type: 'coords_btn' }] },
                'particle': { title: "Particle", icon: "fa-solid fa-smog", fields: [{ id: 'coords', label: 'Select Coords', type: 'coords_btn' }, { id: 'dict', label: 'Dict', type: 'text', default: 'core' }, { id: 'particle', label: 'Particle', type: 'text', default: 'ent_dst_concrete_large' }, { id: 'duration', label: 'Duration', type: 'number', default: 3 }, { id: 'scale', label: 'Scale', type: 'number', default: 1 }] },
                'customevent': { title: "Trigger Custom Client Event", icon: "fa-solid fa-code", fields: [{ id: 'name', label: 'Event Name', type: 'text', default: 'plt_robbery_creator:testprint' }, { id: 'args', label: 'Args', type: 'text', default: 'working1, working2' }] }
            },
            "Minigames": {
                'hack': { title: "Hacking (GTAV)", icon: "fa-solid fa-laptop", doubleOption: true, fields: [{ id: 'difficulty', label: 'Difficulty', type: 'select', options: ['easy', 'medium', 'hard', 'expert'], default: 'easy' }, { id: 'playanim', label: 'Play Animation', type: 'select', options: ['true', 'false'], default: 'true' }] },
                'hackwires': { title: "Connect Wires", icon: "fa-solid fa-network-wired", doubleOption: true, fields: [{ id: 'difficulty', label: 'Difficulty', type: 'select', options: ['easy', 'medium', 'hard', 'expert', 'hacker'], default: 'easy' }, { id: 'time', label: 'Time (s)', type: 'number', default: 30 }] },
                'hackbreach': { title: "Find Pattern", icon: "fa-solid fa-code-commit", doubleOption: true, fields: [{ id: 'difficulty', label: 'Difficulty', type: 'select', options: ['easy', 'medium', 'hard', 'expert', 'hacker'], default: 'easy' }, { id: 'time', label: 'Time (s)', type: 'number', default: 30 }] },
                'hackdial': { title: "Hack Dial", icon: "fa-solid fa-arrow-down", doubleOption: true, fields: [{ id: 'difficulty', label: 'Difficulty', type: 'select', options: ['easy', 'medium', 'hard', 'expert', 'hacker'], default: 'easy' }, { id: 'time', label: 'Time (s)', type: 'number', default: 30 }] },
                'lockpickminigame': { title: "Lockpick", icon: "fa-solid fa-lock-open", doubleOption: true, fields: [{ id: 'difficulty', label: 'Difficulty', type: 'select', options: ['easy', 'medium', 'hard', 'expert', 'hacker'], default: 'easy' }, { id: 'time', label: 'Time (s)', type: 'number', default: 30 }] },
                'sumnumbers': { title: "Sum Numbers", icon: "fa-solid fa-arrow-down-1-9", doubleOption: true, fields: [{ id: 'difficulty', label: 'Difficulty', type: 'select', options: ['easy', 'medium', 'hard', 'expert', 'hacker'], default: 'easy' }, { id: 'time', label: 'Time (s)', type: 'number', default: 30 }] },
                'hackfirewall': { title: "Hack Firewall", icon: "fa-solid fa-border-all", doubleOption: true, fields: [{ id: 'difficulty', label: 'Difficulty', type: 'select', options: ['easy', 'medium', 'hard', 'expert', 'hacker'], default: 'easy' }, { id: 'time', label: 'Time (s)', type: 'number', default: 30 }] }
            },
            "TextUI": {
                'showtextui': { title: "Show Text UI", icon: "fa-solid fa-comment", fields: [{ id: 'title', label: 'Title', type: 'text', default: 'Title' }, { id: 'msg', label: 'Label', type: 'text', default: 'Message' }, { id: 'pos', label: 'Position', type: 'select', options: ['left', 'right', 'center', 'bottom-left', 'bottom-right', 'top-left', 'top-right'], default: 'right' }, { id: 'icon', label: 'Icon', type: 'text', default: 'fa-solid fa-comment' }] },
                'hidetextui': { title: "Hide Text UI", icon: "fa-solid fa-comment-slash", fields: [] }
            },
            "Robbery": {
                'stealjewellery': { title: "Steal Jewellery Heist", icon: "fa-solid fa-image-portrait", fields: [{ id: 'coords', label: 'Vector (x,y,z)', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Break' }, { id: 'item', label: 'Required Item', type: 'text', default: 'weapon_pistol' }] },
                'stealart': { title: "Steal Art", icon: "fa-solid fa-image-portrait", showProp: "ch_prop_vault_painting_01a", fields: [{ id: 'coords', label: 'Vector (x,y,z)', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Start Stealing Art' }, { id: 'item', label: 'Required Item', type: 'text', default: 'weapon_knife' }, { id: 'isnetwork', label: 'Network/Local', type: 'select', options: ['local', 'network'], default: 'network' }] },
                'stealcash': { title: "Steal Trolley", icon: "fa-solid fa-cart-shopping", showProp: "hei_prop_hei_cash_trolly_01", fields: [{ id: 'coords', label: 'Position', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Grab' }, { id: 'loot', label: 'Loot Type', type: 'select', options: ['cash', 'gold', 'diamond', 'coke'] }, { id: 'isnetwork', label: 'Network/Local', type: 'select', options: ['local', 'network'], default: 'network' }] },
                'stealchest': { title: "Steal Chest land", icon: "fa-solid fa-toolbox", showProp: "h4_prop_h4_chest_01a", fields: [{ id: 'coords', label: 'Position', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Open chest' }, { id: 'isnetwork', label: 'Network/Local', type: 'select', options: ['local', 'network'], default: 'network' }] },
                'stealgoldengun': { title: "Steal Golden Gun", icon: "fa-solid fa-gun", showProp: "h4_prop_office_desk_01", fields: [{ id: 'coords', label: 'Select Coords', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Steal' }, { id: 'isnetwork', label: 'Network/Local', type: 'select', options: ['local', 'network'], default: 'network' }] },
                'stealsafecrack': { title: "Safe Cracking", icon: "fa-solid fa-shield", showProp: "h4_prop_h4_safe_01a", fields: [{ id: 'coords', label: 'Position', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Start Cracking Safe' }, { id: 'isnetwork', label: 'Network/Local', type: 'select', options: ['local', 'network'], default: 'network' }] },
                'plantbomb': { title: "Plant Bomb", icon: "fa-solid fa-bomb", showPedMinigamePreview: true, fields: [{ id: 'coords', label: 'Select Coords', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Plant Bomb' }, { id: 'time', label: 'Time (s)', type: 'number', default: 3 }, { id: 'item', label: 'Required Item', type: 'text', default: 'bomb' }] },
                'glasscut': { title: "Glass Cutting", icon: "fa-solid fa-magnifying-glass", showProp: "h4_prop_h4_glass_disp_01b", fields: [{ id: 'coords', label: 'Position', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Start Glass Cutting' }, { id: 'item', label: 'Required Item', type: 'text', default: 'glass_cutter' }, { id: 'rewarditem', label: 'Reward Item', type: 'select', options: ['diamond', 'pantera', 'necklace', 'tequila'], default: 'diamond' }, { id: 'isnetwork', label: 'Network/Local', type: 'select', options: ['local', 'network'], default: 'network' }] },
                'stealcustomprop': {
                    title: "Steal/Spawn Custom Prop", icon: "fa-solid fa-box", isCustomProp: true,
                    fields: [
                        { id: 'coords', label: 'Position', type: 'coords_btn' },
                        { id: 'model', label: 'Prop Model Name', type: 'text', default: 'xm3_prop_xm3_box_wood03a' },
                        { id: 'addtarget', label: 'Add Target?', type: 'select', options: ['true', 'false'], default: 'true' },
                        { id: 'msg', label: 'Label', type: 'text', default: 'Steal' },
                        { id: 'animdict', label: 'Animation Dict', type: 'text', default: 'mini@repair' },
                        { id: 'animclip', label: 'Animation Clip', type: 'text', default: 'fixing_a_player' },
                        { id: 'animduration', label: 'Duration (s)', type: 'number', default: 3 },
                        { id: 'progresstext', label: 'Progress Text', type: 'text', default: 'Stealing...' },
                        { id: 'isnetwork', label: 'Network/Local', type: 'select', options: ['local', 'network'], default: 'network' }
                    ]
                },
                'stealcontainer': { title: "Steal Container", icon: "fa-solid fa-box-open", showProp: "tr_prop_tr_container_01a", fields: [{ id: 'coords', label: 'Position', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Open Container' }, { id: 'minigame', label: 'Mini game', type: 'select', options: ['none', 'lockpick'] }, { id: 'difficulty', label: 'Difficulty', type: 'select', options: ['easy', 'medium', 'hard', 'expert', 'hacker'], default: 'easy' }, { id: 'time', label: 'Time', type: 'number', default: 30 }, { id: 'item', label: 'Required Item', type: 'text', default: 'cutter' }, { id: 'isnetwork', label: 'Network/Local', type: 'select', options: ['local', 'network'], default: 'network' }] },
                'stealsandbox': { title: "Steal Sand Box", icon: "fa-solid fa-hourglass-half", showProp: "tr_prop_tr_sand_01a", fields: [{ id: 'coords', label: 'Position', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Steal Box' }, { id: 'minigame', label: 'Mini game', type: 'select', options: ['none', 'sumnumbers'] }, { id: 'difficulty', label: 'Difficulty', type: 'select', options: ['easy', 'medium', 'hard', 'expert', 'hacker'], default: 'easy' }, { id: 'time', label: 'Time', type: 'number', default: 30 }, { id: 'item', label: 'Required Item', type: 'text', default: 'lockpick' }, { id: 'isnetwork', label: 'Network/Local', type: 'select', options: ['local', 'network'], default: 'network' }] },
                'lootcrate': { title: "Loot Crate", icon: "fa-solid fa-box-archive", showProp: "xm3_prop_xm3_crate_01a", fields: [{ id: 'coords', label: 'Position', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Loot' }, { id: 'item', label: 'Required Item', type: 'text', default: 'weapon_crowbar' }, { id: 'isnetwork', label: 'Network/Local', type: 'select', options: ['local', 'network'], default: 'network' }] },
                'openelectricbox': { title: "Electric Box", icon: "fa-solid fa-car-battery", showProp: "tr_prop_tr_elecbox_01a", fields: [{ id: 'coords', label: 'Position', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Open Electric Box' }, { id: 'isnetwork', label: 'Network/Local', type: 'select', options: ['local', 'network'], default: 'network' }] },
                'switchboxon': { title: "Switch Box ON", icon: "fa-solid fa-plug", showProp: "xm_prop_x17_powerbox_01", fields: [{ id: 'coords', label: 'Position', type: 'coords_btn' }, { id: 'msg', label: 'Label', type: 'text', default: 'Open Electric Box' }, { id: 'isnetwork', label: 'Network/Local', type: 'select', options: ['local', 'network'], default: 'network' }] }
            },
            "Rewards": {
                'giveitem': { title: "Give Item", icon: "fa-solid fa-sack-dollar", fields: [{ id: 'itemname', label: 'Item Name', type: 'text', default: 'money' }, { id: 'amount', label: 'Amount', type: 'number', default: 100 }] },
                'givemoney': { title: "Give Money / Black Money", icon: "fa-solid fa-money-bill", fields: [{ id: 'rewardtype', label: 'Select reward', type: 'select', options: ['money', 'black_money'], default: 'cash' }, { id: 'amount', label: 'Amount', type: 'number', default: 100 }] }
            },
            "Cutscenes": {
                'buyers': { title: "Buyers", icon: "fa-solid fa-sack-dollar", showCar: "baller2", fields: [{ id: 'coords', label: 'Vector (x,y,z)', type: 'coords_btn' }, { id: 'carmodel', label: 'Car model', type: 'text', default: 'baller2' }, { id: 'radius', label: 'Radius Interaction', type: 'number', default: 15 }, { id: 'blipname', label: 'Blip Name', type: 'text', default: 'Buyer' }] }
            }
        }
    };

    window.postMessage({
        action: 'openEditor',
        config: config
    }, "*");
}

triggerOpenEditorWithFullData();