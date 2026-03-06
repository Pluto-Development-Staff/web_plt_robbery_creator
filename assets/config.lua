Config = {}

Config.InventorySystem = 'ox' -- auto, ox, qb, quasar, core, codem, tgiann, origen
Config.TargetSystem = 'ox'    -- auto, ox, qb

Config.DebugPrints = true
Config.DebugZones = false

Config.AdminGroups = { 'admin', 'best' }
Config.CommandName = 'robbery_editor'

Config.SkillTreeCommand = 'skilltree'

Config.SecondsAfterPropDissapear = 20

Config.NodeSchemas = {

    -- =========================
    -- ACTIONS
    -- =========================
    ["Actions"] = {
        ['guards'] = {
            title = "Spawn NPC Guard",
            icon = "fa-person-military-rifle",
            showNPC = true,
            fields = {
                { id = 'coords',        label = 'Vector (x,y,z)',                                         type = 'coords_btn' },
                { id = 'model',         label = 'Ped Model',                                              type = 'text',      default = 's_m_m_security_01' },
                { id = 'weapon',        label = 'Weapon',                                                 type = 'text',      default = 'WEAPON_PISTOL' },
                { id = 'amount',        label = 'Amount',                                                 type = 'number',    default = 1 },
                { id = 'setting_1',     label = 'Invinicble',                                             type = 'select',    options = { 'true', 'false' },      default = 'false' },
                { id = 'setting_2',     label = 'Freeze Position',                                        type = 'select',    options = { 'true', 'false' },      default = 'true' },

                { id = 'dropGuardProp', label = 'Drop prop on ground after death',                        type = 'text',      default = 'xm3_prop_xm3_pistol_xm3' },
                { id = 'dropGuardItem', label = 'Item that will player receive after taking up the prop', type = 'text',      default = 'WEAPON_PISTOL' },
                { id = 'count',         label = 'Item count',                                             type = 'number',    default = 1 },
                { id = 'msg',           label = 'Label',                                                  type = 'text',      default = 'Take up weapon' },
                { id = 'icon',          label = 'Icon',                                                   type = 'text',      default = 'fa-solid fa-gun' },
            }
        },

        ['spawnnpc'] = {
            title = "Spawn NPC",
            icon = "fa-solid fa-person",
            showNPC = true,
            fields = {
                { id = 'coords',    label = 'Vector (x,y,z)',                                                    type = 'coords_btn' },
                { id = 'model',     label = 'Ped Model',                                                         type = 'text',      default = 'a_m_m_salton_04' },
                { id = 'setting_1', label = 'Invinicble',                                                        type = 'select',    options = { 'true', 'false' }, default = 'false' },
                { id = 'setting_2', label = 'Freeze Position',                                                   type = 'select',    options = { 'true', 'false' }, default = 'true' },
                { id = 'handsup',   label = 'Hands Up when aimed at',                                            type = 'select',    options = { 'true', 'false' }, default = 'false' },
                { id = 'addtarget', label = 'Add Target? If no then all of the options below will be forgotten', type = 'select',    options = { 'true', 'false' } },
                { id = 'msg',       label = 'Label',                                                             type = 'text',      default = 'Interact' },
                { id = 'icon',      label = 'Icon',                                                              type = 'text',      default = 'fa-solid fa-person' },
                { id = 'cooldown',  label = 'Global Cooldown (in seconds)',                                      type = 'number',    default = 10 },

                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['opendoor'] = {
            title = "Open Door",
            icon = "fa-solid fa-door-open",
            selectEntity = { "door" },
            fields = {
                { id = 'coords', label = 'Select Coords', type = 'coords_btn' }
            }
        },

        ['closedoor'] = {
            title = "Close Door",
            icon = "fa-solid fa-door-open",
            selectEntity = { "door" },
            fields = {
                { id = 'coords', label = 'Select Coords', type = 'coords_btn' }
            }
        },

        ['drillvault'] = {
            title = "Open Vault Door",
            icon = "fa-solid fa-door-open",
            selectEntity = { "v_ilev_bk_vaultdoor", "v_ilev_gb_vauldr" },
            fields = {
                { id = 'coords', label = 'Select Coords', type = 'coords_btn' }
            }
        },

        ['swipecard'] = {
            title = "Card Swipe",
            icon = "fa-solid fa-id-card",
            showPedMinigamePreview = true,
            fields = {
                { id = 'coords', label = 'Select Coords', type = 'coords_btn' },
                { id = 'msg',    label = 'Label',         type = 'text',      default = 'Swipe Card' },
                { id = 'item',   label = 'Required Item', type = 'text',      default = 'access_card' },
            }
        },

        ['thermalcharge'] = {
            title = "Thermal Charge",
            icon = "fa-solid fa-fire-burner",
            selectEntity = { "door" },
            showPedMinigamePreview = true,
            fields = {
                { id = 'coords', label = 'Select Coords', type = 'coords_btn' },
                { id = 'msg',    label = 'Label',         type = 'text',      default = 'Melt Lock' },
                { id = 'item',   label = 'Required Item', type = 'text',      default = 'thermite' },
            }
        },

        ['playanim'] = {
            title = "Play Animation",
            icon = "fa-solid fa-person-walking-arrow-right",
            fields = {
                { id = 'animdict',     label = 'Animation Dict',     type = 'text',   default = 'random@domestic' },
                { id = 'animclip',     label = 'Animation Clip',     type = 'text',   default = 'pickup_low' },
                { id = 'animduration', label = 'Animation Duration', type = 'number', default = 1800 },
            }
        },

        ['waitforcombat'] = {
            title = "Wait for combat",
            icon = "fa-solid fa-child-combatant",
            fields = {
                { id = 'coords',   label = 'Select Coords',                type = 'coords_btn' },
                { id = 'radius',   label = 'Radius',                       type = 'number',    default = 10 },
                { id = 'cooldown', label = 'Global Cooldown (in seconds)', type = 'number',    default = 60 },
            }
        },
    },

    ["Script Actions"] = {
        ['checkskilltree'] = {
            title = "Check required skill",
            icon = "fa-solid fa-question",
            doubleOption = true,
            fields = {
                {
                    id = 'skill_id',
                    label = 'Select Required Skill',
                    type = 'select',
                    options = {
                        'hacking_gtav',
                        'connect_wires',
                        'find_pattern',
                        'hack_firewall',
                        'hack_dial',
                        'lockpick',
                        'sum_numbers'
                    },
                    default = 'hacking_gtav'
                },
            }
        },

        ['changeskillvalue'] = {
            title = "Change skill points",
            icon = "fa-solid fa-check",
            fields = {
                { id = 'action', label = 'Select Action', type = 'select', options = { 'add', 'remove', 'set' }, default = 'add' },
                { id = 'value',  label = 'Value',         type = 'number', default = 1 },
            }
        },

        ['target'] = {
            title = "Set Target / Interaction",
            icon = "fa-solid fa-eye",
            fields = {
                { id = 'coords',    label = 'Vector (x,y,z)',                             type = 'coords_btn' },
                { id = 'radius',    label = 'Radius',                                     type = 'number',    default = 2.0 },
                { id = 'players',   label = 'Minimum Players (players must be near you)', type = 'select',    options = { 1, 2, 3, 4 },      default = 1 },
                { id = 'msg',       label = 'Label',                                      type = 'text',      default = 'Interact' },
                { id = 'icon',      label = 'Icon',                                       type = 'text',      default = 'fa-solid fa-eye' },
                { id = 'disappear', label = 'Disappear after click',                      type = 'select',    options = { 'true', 'false' }, default = 'true' },
                { id = 'cooldown',  label = 'Global Cooldown (in seconds)',               type = 'number',    default = 0 },
            }
        },

        ['showtarget'] = {
            title = "Show Hidden Target / Interaction",
            icon = "fa-regular fa-eye",
            fields = {
                { id = 'targetNodeId', label = 'Select Target to Show', type = 'select', options = {} }
            }
        },

        ['wait'] = {
            title = "Wait",
            icon = "fa-solid fa-clock",
            fields = {
                { id = 'wait', label = 'Wait (time in seconds)', type = 'number', default = 2 },
            }
        },

        ['teleport'] = {
            title = "Teleport",
            icon = "fa-solid fa-arrows-up-down-left-right",
            showNPC = true,
            fields = {
                { id = 'coords',  label = 'Vector (x,y,z)', type = 'coords_btn' },
                { id = 'fadeout', label = 'Fade In/Out',    type = 'select',    options = { 'true', 'false' }, default = 'true' },
            }
        },

        ['explosion'] = {
            title = "Explosion",
            icon = "fa-solid fa-bomb",
            fields = {
                { id = 'coords', label = 'Vector (x,y,z)',   type = 'coords_btn' },
                { id = 'size',   label = 'Size',             type = 'select',    options = { 'small', 'medium', 'big', 'huge' }, default = 'medium' },
                { id = 'damage', label = 'Is doing damage?', type = 'select',    options = { 'true', 'false' },                  default = 'true' },
            }
        },

        ['alertpolice'] = {
            title = "Alert Police",
            icon = "fa-solid fa-circle-exclamation",
            fields = {
                { id = 'msg', label = 'Label', type = 'text', default = 'Robbery in progress!' },
            }
        },

        ['alarm'] = {
            title = "Play Alarm",
            icon = "fa-solid fa-bell",
            fields = {
                { id = 'coords',    label = 'Select Coords',         type = 'coords_btn' },
                { id = 'duration',  label = 'Duration (in seconds)', type = 'number',    default = 30 },
                { id = 'range',     label = 'Range',                 type = 'number',    default = 5 },
                { id = 'alarmtype', label = 'Type of alarm',         type = 'text',      default = 'ALARMS_KLAXON_03_FAR' },
            }
        },

        ['notification'] = {
            title = "Notify",
            icon = "fa-regular fa-bell",
            fields = {
                { id = 'title', label = 'Title', type = 'text', default = 'Title of Notify' },
                { id = 'msg',   label = 'Label', type = 'text', default = 'Label of Notify' },
            }
        },

        ['randomize'] = {
            title = "Randomize",
            icon = "fa-solid fa-shuffle",
            fields = {}
        },

        ['waypoint'] = {
            title = "Set Waypoint",
            icon = "fa-solid fa-location-dot",
            fields = {
                { id = 'coords', label = 'Select Coords', type = 'coords_btn' },
            }
        },

        ['particle'] = {
            title = "Particle",
            icon = "fa-solid fa-smog",
            fields = {
                { id = 'coords',   label = 'Select Coords', type = 'coords_btn' },
                { id = 'dict',     label = 'Particle Dict', type = 'text',      default = 'core' },
                { id = 'particle', label = 'Particle',      type = 'text',      default = 'ent_dst_concrete_large' },
                { id = 'duration', label = 'Duration',      type = 'number',    default = 3 },
                { id = 'scale',    label = 'Scale',         type = 'number',    default = 1 },
            }
        },

        ['customevent'] = {
            title = "Trigger Custom Client Event",
            icon = "fa-solid fa-code",
            fields = {
                { id = 'name', label = 'Custom Client Event To Trigger', type = 'text', default = 'plt_robbery_creator:testprint' },
                { id = 'args', label = 'Args',                           type = 'text', default = 'working1, working2' },
            }
        },

        ['setuphouse'] = {
            title = "Setup custom house/shell",
            icon = "fa-solid fa-house",
            fields = {
                { id = 'coords', label = 'Select Coords', type = 'coords_btn' },
                { id = 'tier',   label = 'Tier',          type = 'select',    options = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 }, default = 1 },
                { id = 'msg',    label = 'Enter',         type = 'text' },
                { id = 'msg2',   label = 'Leave',         type = 'text' },
            }
        },
    },

    -- =========================
    -- MINIGAMES
    -- =========================
    Minigames = {
        ['opencomputer'] = {
            title = "Open Computer",
            icon = "fa-solid fa-computer",
            fields = {
            }
        },

        ['hack'] = {
            title = "Hacking (GTAV)",
            icon = "fa-solid fa-laptop",
            doubleOption = true,
            fields = {
                { id = 'difficulty', label = 'Difficulty',             type = 'select', options = { 'easy', 'medium', 'hard', 'expert' }, default = 'easy' },
                { id = 'playanim',   label = 'Play Hacking Animation', type = 'select', options = { 'true', 'false' },                    default = 'true' },
            }
        },

        ['hackwires'] = {
            title = "Connect Wires",
            icon = "fa-solid fa-network-wired",
            doubleOption = true,
            fields = {
                { id = 'difficulty', label = 'Difficulty',        type = 'select', options = { 'easy', 'medium', 'hard', 'expert', 'hacker' }, default = 'easy' },
                { id = 'time',       label = 'Time (in seconds)', type = 'number', default = 30 },
            }
        },

        ['hackbreach'] = {
            title = "Find Pattern",
            icon = "fa-solid fa-code-commit",
            doubleOption = true,
            fields = {
                { id = 'difficulty', label = 'Difficulty',        type = 'select', options = { 'easy', 'medium', 'hard', 'expert', 'hacker' }, default = 'easy' },
                { id = 'time',       label = 'Time (in seconds)', type = 'number', default = 30 },
            }
        },

        ['hackdial'] = {
            title = "Hack Dial",
            icon = "fa-solid fa-arrow-down",
            doubleOption = true,
            fields = {
                { id = 'difficulty', label = 'Difficulty',        type = 'select', options = { 'easy', 'medium', 'hard', 'expert', 'hacker' }, default = 'easy' },
                { id = 'time',       label = 'Time (in seconds)', type = 'number', default = 30 },
            }
        },

        ['lockpickminigame'] = {
            title = "Lockpick",
            icon = "fa-solid fa-lock-open",
            doubleOption = true,
            fields = {
                { id = 'difficulty', label = 'Difficulty',        type = 'select', options = { 'easy', 'medium', 'hard', 'expert', 'hacker' }, default = 'easy' },
                { id = 'time',       label = 'Time (in seconds)', type = 'number', default = 30 },
            }
        },

        ['sumnumbers'] = {
            title = "Sum Numbers",
            icon = "fa-solid fa-arrow-down-1-9",
            doubleOption = true,
            fields = {
                { id = 'difficulty', label = 'Difficulty',        type = 'select', options = { 'easy', 'medium', 'hard', 'expert', 'hacker' }, default = 'easy' },
                { id = 'time',       label = 'Time (in seconds)', type = 'number', default = 30 },
            }
        },

        ['hackfirewall'] = {
            title = "Hack Firewall",
            icon = "fa-solid fa-border-all",
            doubleOption = true,
            fields = {
                { id = 'difficulty', label = 'Difficulty',        type = 'select', options = { 'easy', 'medium', 'hard', 'expert', 'hacker' }, default = 'easy' },
                { id = 'time',       label = 'Time (in seconds)', type = 'number', default = 30 },
            }
        },
    },

    TextUI = {
        ['showtextui'] = {
            title = "Show Text UI",
            icon = "fa-solid fa-comment",
            fields = {
                { id = 'title', label = 'Title',    type = 'text',   default = 'Title' },
                { id = 'msg',   label = 'Label',    type = 'text',   default = 'Message' },
                { id = 'pos',   label = 'Position', type = 'select', options = { 'left', 'right', 'center', 'bottom-left', 'bottom-right', 'top-left', 'top-right' }, default = 'right' },
                { id = 'icon',  label = 'Icon',     type = 'text',   default = 'fa-solid fa-comment' },
            }
        },
        ['hidetextui'] = {
            title = "Hide Text UI",
            icon = "fa-solid fa-comment-slash",
            fields = {}
        },
    },

    -- =========================
    -- ROBBERY
    -- =========================
    Robbery = {
        ['stealjewellery'] = {
            title = "Steal Jewellery Heist",
            icon = "fa-solid fa-image-portrait",
            fields = {
                { id = 'coords', label = 'Vector (x,y,z)', type = 'coords_btn' },
                { id = 'msg',    label = 'Label',          type = 'text',      default = 'Break' },
                { id = 'item',   label = 'Required Item',  type = 'text',      default = 'weapon_pistol' },
            }
        },

        ['stealart'] = {
            title = "Steal Art",
            icon = "fa-solid fa-image-portrait",
            showProp = "ch_prop_vault_painting_01a",
            fields = {
                { id = 'coords', label = 'Vector (x,y,z)', type = 'coords_btn' },
                { id = 'msg',    label = 'Label',          type = 'text',      default = 'Start Stealing Art' },
                { id = 'item',   label = 'Required Item',  type = 'text',      default = 'weapon_knife' },
                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['stealcash'] = {
            title = "Steal Trolley",
            icon = "fa-solid fa-cart-shopping",
            showProp = "hei_prop_hei_cash_trolly_01",
            fields = {
                { id = 'coords', label = 'Position',  type = 'coords_btn' },
                { id = 'msg',    label = 'Label',     type = 'text',      default = 'Grab' },
                { id = 'loot',   label = 'Loot Type', type = 'select',    options = { 'cash', 'gold', 'diamond', 'coke' } },
                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['stealchest'] = {
            title = "Steal Chest land",
            icon = "fa-solid fa-toolbox",
            showProp = "h4_prop_h4_chest_01a",
            fields = {
                { id = 'coords', label = 'Position', type = 'coords_btn' },
                { id = 'msg',    label = 'Label',    type = 'text',      default = 'Open chest' },
                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['stealgoldengun'] = {
            title    = "Steal Golden Gun",
            icon     = "fa-solid fa-gun",
            showProp = "h4_prop_office_desk_01",
            fields   = {
                { id = 'coords', label = 'Select Coords', type = 'coords_btn' },
                { id = 'msg',    label = 'Label',         type = 'text',      default = 'Steal' },
                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['stealsafecrack'] = {
            title = "Safe Cracking",
            icon = "fa-solid fa-shield",
            showProp = "h4_prop_h4_safe_01a",
            fields = {
                { id = 'coords', label = 'Position', type = 'coords_btn' },
                { id = 'msg',    label = 'Label',    type = 'text',      default = 'Start Cracking Safe' },
                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['plantbomb'] = {
            title = "Plant Bomb",
            icon = "fa-solid fa-bomb",
            showPedMinigamePreview = true,
            fields = {
                { id = 'coords', label = 'Select Coords',                           type = 'coords_btn' },
                { id = 'msg',    label = 'Label',                                   type = 'text',      default = 'Plant Bomb' },
                { id = 'time',   label = 'Time after bomb disappears (in seconds)', type = 'number',    default = 3 },
                { id = 'item',   label = 'Required Item',                           type = 'text',      default = 'bomb' },
            }
        },

        ['glasscut'] = {
            title = "Glass Cutting",
            icon = "fa-solid fa-magnifying-glass",
            showProp = "h4_prop_h4_glass_disp_01b",
            fields = {
                { id = 'coords',     label = 'Position',      type = 'coords_btn' },
                { id = 'msg',        label = 'Label',         type = 'text',      default = 'Start Glass Cutting' },
                { id = 'item',       label = 'Required Item', type = 'text',      default = 'glass_cutter' },
                { id = 'rewarditem', label = 'Reward Item',   type = 'select',    options = { 'diamond', 'pantera', 'necklace', 'tequila' }, default = 'diamond' },
                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['stealcustomprop'] = {
            title = "Steal/Spawn Custom Prop",
            icon = "fa-solid fa-box",
            isCustomProp = true,
            fields = {
                { id = 'coords',       label = 'Position',                                                          type = 'coords_btn' },
                { id = 'model',        label = 'Prop Model Name',                                                   type = 'text',      default = 'xm3_prop_xm3_box_wood03a' },
                { id = 'addtarget',    label = 'Add Target? If no then all of the options below will be forgotten', type = 'select',    options = { 'true', 'false' },       default = 'true' },
                { id = 'msg',          label = 'Label',                                                             type = 'text',      default = 'Steal' },
                { id = 'animdict',     label = 'Animation Dict',                                                    type = 'text',      default = 'mini@repair' },
                { id = 'animclip',     label = 'Animation Clip',                                                    type = 'text',      default = 'fixing_a_player' },
                { id = 'animduration', label = 'Progress Duration (in seconds)',                                    type = 'number',    default = 3 },
                { id = 'progresstext', label = 'Progress Text',                                                     type = 'text',      default = 'Stealing...' },
                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['stealcontainer'] = {
            title = "Steal Container",
            icon = "fa-solid fa-box-open",
            showProp = "tr_prop_tr_container_01a",
            fields = {
                { id = 'coords',     label = 'Position',             type = 'coords_btn' },
                { id = 'msg',        label = 'Label',                type = 'text',      default = 'Open Container' },
                { id = 'minigame',   label = 'Mini game',            type = 'select',    options = { 'none', 'hack', 'wires', 'pattern', 'lockpick', 'dial', 'sumnumbers', 'firewall' }, default = 'none' },
                { id = 'difficulty', label = 'Mini game difficulty', type = 'select',    options = { 'easy', 'medium', 'hard', 'expert', 'hacker' },                                     default = 'easy' },
                { id = 'time',       label = 'Mini Game Time',       type = 'number',    default = 30 },
                { id = 'item',       label = 'Required Item',        type = 'text',      default = 'cutter' },
                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['stealsandbox'] = {
            title = "Steal Sand Box",
            icon = "fa-solid fa-hourglass-half",
            showProp = "tr_prop_tr_sand_01a",
            fields = {
                { id = 'coords',     label = 'Position',             type = 'coords_btn' },
                { id = 'msg',        label = 'Label',                type = 'text',      default = 'Steal Box' },
                { id = 'minigame',   label = 'Mini game',            type = 'select',    options = { 'none', 'hack', 'wires', 'pattern', 'lockpick', 'dial', 'sumnumbers', 'firewall' }, default = 'none' },
                { id = 'difficulty', label = 'Mini game difficulty', type = 'select',    options = { 'easy', 'medium', 'hard', 'expert', 'hacker' },                                     default = 'easy' },
                { id = 'time',       label = 'Mini Game Time',       type = 'number',    default = 30 },
                { id = 'item',       label = 'Required Item',        type = 'text',      default = 'lockpick' },
                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['lootcrate'] = {
            title = "Loot Crate",
            icon = "fa-solid fa-box-archive",
            showProp = "xm3_prop_xm3_crate_01a",
            fields = {
                { id = 'coords', label = 'Position',      type = 'coords_btn' },
                { id = 'msg',    label = 'Label',         type = 'text',      default = 'Loot' },
                { id = 'item',   label = 'Required Item', type = 'text',      default = 'weapon_crowbar' },
                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['openelectricbox'] = {
            title = "Electric Box",
            icon = "fa-solid fa-car-battery",
            showProp = "tr_prop_tr_elecbox_01a",
            fields = {
                { id = 'coords', label = 'Position', type = 'coords_btn' },
                { id = 'msg',    label = 'Label',    type = 'text',      default = 'Open Electric Box' },
                -- { id = 'item',   label = 'Required Item', type = 'text',      default = 'weapon_crowbar' },
                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['switchboxon'] = {
            title = "Switch Box ON",
            icon = "fa-solid fa-plug",
            showProp = "xm_prop_x17_powerbox_01",
            fields = {
                { id = 'coords', label = 'Position', type = 'coords_btn' },
                { id = 'msg',    label = 'Label',    type = 'text',      default = 'Open Electric Box' },
                -- { id = 'item',   label = 'Required Item', type = 'text',      default = 'weapon_crowbar' },
                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['stealvehicle'] = {
            title = "Steal Vehicle",
            icon = "fa-solid fa-car",
            showCar = "baller",
            fields = {
                { id = 'coords',        label = 'Vehicle Spawn Position',   type = 'coords_btn' },
                { id = 'vehiclemodel',  label = 'Vehicle Model',            type = 'text',      default = 'baller' },
                { id = 'msg',           label = 'Interaction Label',        type = 'text',      default = 'Break In' },
                { id = 'item',          label = 'Required Item',            type = 'text',      default = 'lockpick' },
                { id = 'minigame',      label = 'Mini Game',                type = 'select',    options = { 'none', 'hack', 'wires', 'pattern', 'lockpick', 'dial', 'sumnumbers', 'firewall' }, default = 'lockpick' },
                { id = 'difficulty',    label = 'Mini Game Difficulty',     type = 'select',    options = { 'easy', 'medium', 'hard', 'expert', 'hacker' },                                     default = 'easy' },
                { id = 'time',          label = 'Mini Game Time (seconds)', type = 'number',    default = 30 },
                { id = 'delivercoords', label = 'Delivery Point Position',  type = 'coords_btn' },
                { id = 'deliverradius', label = 'Delivery Zone Radius',     type = 'number',    default = 15 },
                { id = 'deliverblip',   label = 'Delivery Blip Name',       type = 'text',      default = 'Deliver Vehicle' },
                {
                    id = 'isnetwork',
                    label =
                    'Local - everyone is spawning their own local copy | Network - one person is spawning and everyone can see | If you are using it for multiplayer robbery set it to network',
                    type = 'select',
                    options = { 'local', 'network' },
                    default = 'network'
                },
            }
        },

        ['atmrobbery'] = {
            title = "ATM Robbery (Bomb)",
            icon = "fa-solid fa-money-check",
            selectEntity = {
                "prop_atm_01",
                "prop_atm_02",
                "prop_atm_03",
                "prop_fleeca_atm",
            },
            fields = {
                { id = 'coords',     label = 'Select ATM',                    type = 'coords_btn' },
                { id = 'msg',        label = 'Interaction Label',             type = 'text',      default = 'Plant Bomb' },
                { id = 'item',       label = 'Required Item',                 type = 'text',      default = 'bomb' },
                { id = 'bombtime',   label = 'Bomb Timer (seconds)',          type = 'number',    default = 5 },
                { id = 'moneytime',  label = 'Money Rain Duration (seconds)', type = 'number',    default = 10 },
                { id = 'collectmsg', label = 'Collect Loot Label',            type = 'text',      default = 'Collect Money' },
                { id = 'cooldown',   label = 'Cooldown (seconds)',            type = 'number',    default = 300 },
            }
        },

        ['atmroperobbery'] = {
            title = "ATM Rope Robbery",
            icon = "fa-solid fa-link",
            selectEntity = {
                "prop_atm_02",
                "prop_atm_03",
                "prop_fleeca_atm",
            },
            fields = {
                { id = 'coords',      label = 'Select ATM',             type = 'coords_btn' },
                { id = 'msg',         label = 'Interaction Label',      type = 'text',      default = 'Attach Rope' },
                { id = 'item',        label = 'Required Item',          type = 'text',      default = 'pl_rope' },
                { id = 'attachmsg',   label = 'Progress Label',         type = 'text',      default = 'Attaching Rope to ATM' },
                { id = 'attachedmsg', label = 'TextUI Label',           type = 'text',      default = 'Rope attached! Now attach it to a vehicle' },
                { id = 'targetmsg',   label = 'Target Label',            type = 'text',      default = 'Attach Rope to Vehicle' },
                { id = 'ropemsg',     label = 'Rope Attached Message',   type = 'text',      default = 'Rope attached! Drive away' },
                { id = 'snapmsg',     label = 'Rope Snapped Message',    type = 'text',      default = 'The rope snapped!' },
                { id = 'detachmsg',   label = 'ATM Detached Message',   type = 'text',      default = 'ATM detached! Rob it now' },
                { id = 'robmsg',      label = 'Rob ATM Label',          type = 'text',      default = 'Rob Detached ATM' },
                { id = 'robbingmsg',  label = 'Robbing Progress Label', type = 'text',      default = 'Robbing ATM...' },
                { id = 'notfoundmsg', label = 'ATM Not Found Message',  type = 'text',      default = 'ATM not found!' },
                { id = 'dragforce',   label = 'Drag Force (0.0 - 1.0)', type = 'number',    default = 0.2 },
                { id = 'resistance',  label = 'Resistance Force',       type = 'number',    default = 0.05 },
                { id = 'reldist',     label = 'Required Pull Distance', type = 'number',    default = 4.0 },
                { id = 'maxrope',     label = 'Max Rope Length',        type = 'number',    default = 25.0 },
                { id = 'tautrope',    label = 'Taut Rope Length',       type = 'number',    default = 8.0 },
                { id = 'cooldown',    label = 'Cooldown (seconds)',     type = 'number',    default = 300 },
            }
        },

        ['grupe6robbery'] = {
            title = "Gruppe 6 Truck Robbery",
            icon = "fa-solid fa-truck",
            showCar = "stockade",
            fields = {
                { id = 'coords',      label = 'Truck Spawn Position (Point A)',  type = 'coords_btn' },
                { id = 'destcoords',  label = 'Destination Position (Point B)',  type = 'coords_btn' },
                { id = 'truckmodel',  label = 'Truck Model',                     type = 'text',      default = 'stockade' },
                { id = 'drivermodel', label = 'Driver Ped Model',                type = 'text',      default = 's_m_m_security_01' },
                { id = 'starthour',   label = 'Active Start Hour (0-23)',        type = 'number',    default = 0 },
                { id = 'endhour',     label = 'Active End Hour (0-23)',          type = 'number',    default = 23 },
                { id = 'showblip',    label = 'Show Blip For Everyone',          type = 'select',    options = { 'true', 'false' },                                                                  default = 'true' },
                { id = 'blipname',    label = 'Blip Name',                       type = 'text',      default = 'Gruppe 6' },
                { id = 'msg',         label = 'Interaction Label',               type = 'text',      default = 'Open Back' },
                { id = 'openmethod',  label = 'Open Method',                     type = 'select',    options = { 'minigame', 'bomb' },                                                               default = 'minigame' },
                { id = 'item',        label = 'Required Item (minigame method)', type = 'text',      default = 'lockpick' },
                { id = 'minigame',    label = 'Mini Game',                       type = 'select',    options = { 'none', 'hack', 'wires', 'pattern', 'lockpick', 'dial', 'sumnumbers', 'firewall' }, default = 'lockpick' },
                { id = 'difficulty',  label = 'Mini Game Difficulty',            type = 'select',    options = { 'easy', 'medium', 'hard', 'expert', 'hacker' },                                     default = 'easy' },
                { id = 'time',        label = 'Mini Game Time (seconds)',        type = 'number',    default = 30 },
                { id = 'bombitem',    label = 'Required Item (bomb method)',     type = 'text',      default = 'bomb' },
                { id = 'bombtime',    label = 'Bomb Timer (seconds)',            type = 'number',    default = 5 },
                { id = 'drivespeed',  label = 'Drive Speed',                     type = 'number',    default = 20 },
                { id = 'cooldown',    label = 'Respawn Cooldown (seconds)',      type = 'number',    default = 300 },
            }
        },
    },

    -- =========================
    -- REWARDS
    -- =========================
    Rewards = {
        ['giveitem'] = {
            title = "Give Item",
            icon = "fa-solid fa-sack-dollar",
            fields = {
                { id = 'itemname', label = 'Item Name', type = 'text',   default = 'money' },
                { id = 'amount',   label = 'Amount',    type = 'number', default = 100 },
            }
        },

        ['givemoney'] = {
            title = "Give Money / Black Money",
            icon = "fa-solid fa-money-bill",
            fields = {
                { id = 'rewardtype', label = 'Select reward', type = 'select', options = { 'money', 'black_money' }, default = 'cash' },
                { id = 'amount',     label = 'Amount',        type = 'number', default = 100 },
            }
        },
    },

    Cutscenes = {
        ['buyers'] = {
            title = "Buyers",
            icon = "fa-solid fa-sack-dollar",
            showCar = "baller2",
            fields = {
                { id = 'coords',   label = 'Vector (x,y,z)',     type = 'coords_btn' },
                { id = 'carmodel', label = 'Car model',          type = 'text',      default = 'baller2' },
                { id = 'radius',   label = 'Radius Interaction', type = 'number',    default = 15 },
                { id = 'blipname', label = 'Blip Name',          type = 'text',      default = 'Buyer' },
            }
        },

        ['tun_asd_ext'] = {
            title = "Vehicle Delivery Buyer",
            icon = "fa-solid fa-car-side",
            fields = {
                { id = 'coords',   label = 'Vector (x,y,z)',     type = 'coords_btn' },
                { id = 'radius',   label = 'Radius Interaction', type = 'number',    default = 15 },
                { id = 'blipname', label = 'Blip Name',          type = 'text',      default = 'Vehicle Buyer' },
            }
        },
    },

}

Config.SkillTrees = {
    ['hacker'] = {
        title = "CYBERNETICS",
        icon = "fa-microchip",
        description = "Master digital security bypassing and electronic systems.",
        nodes = {
            -- Level 1
            {
                id = 'hacking_gtav',
                label = 'Hacking (GTAV)',
                icon = 'fa-laptop',
                cost = 1,
                row = 1,
                col = 2,
                req = nil,
                desc = "Basic understanding of terminal-based security systems."
            },

            -- Level 2
            {
                id = 'find_pattern',
                label = 'Find Pattern',
                icon = 'fa-code-commit',
                cost = 2,
                row = 2,
                col = 1,
                req = 'hacking_gtav',
                desc = "Advanced pattern recognition in encrypted data streams."
            },
            {
                id = 'hack_dial',
                label = 'Hack Dial',
                icon = 'fa-arrow-down',
                cost = 2,
                row = 2,
                col = 3,
                req = 'hacking_gtav',
                desc = "Bypass digital rotary locks and frequency-based encoders."
            },

            -- Level 3
            {
                id = 'connect_wires',
                label = 'Connect Wires',
                icon = 'fa-network-wired',
                cost = 3,
                row = 3,
                col = 1,
                req = 'find_pattern',
                desc = "Expert knowledge of hardware circuitry and alarm triggers."
            },

            {
                id = 'hack_firewall',
                label = 'Hack Firewall',
                icon = 'fa-solid fa-border-all',
                cost = 3,
                row = 3,
                col = 3,
                req = 'hack_dial',
                desc = "Hack most difficult systems by jailbreaking their firewalls."
            },
        }
    },

    ['thief'] = {
        title = "INFILTRATION",
        icon = "fa-mask",
        description = "Physical security bypassing and manual dexterity skills.",
        nodes = {
            -- Level 1
            {
                id = 'lockpick',
                label = 'Lockpick',
                icon = 'fa-lock-open',
                cost = 1,
                row = 1,
                col = 2,
                req = nil,
                desc = "Ability to manipulate and open standard mechanical locks."
            },

            -- Level 2
            {
                id = 'sum_numbers',
                label = 'Sum Numbers',
                icon = 'fa-arrow-down-1-9',
                cost = 2,
                row = 2,
                col = 2,
                req = 'lockpick',
                desc = "The skill to quickly crack safe combinations and dial sequences."
            },
        }
    },
}

Config.Translations = {
    Title = "Robbery Creator",
    Saved = 'Saved and reloaded!',
    Created = 'Created Robbery ID: ',
    Deleted = 'Deleted Robbery ID: ',
    DontHaveRequiredItem = "You don't have the required item!",
    Cooldown = 'This target is on cooldown',
    common = {
        unknown = "Unknown Heist",
        heist_created = "Heist created with ID: %s",
        heist_updated = "Heist updated ID: %s"
    },
    selector = {
        help_text = "Move your mouse to aim at a position",
        help_text2 = " | [Scroll] Rotate | [ENTER] Confirm",
        help_text3 = "Press [LBM] to cut",
        help_text4 = "Move mouse to aim | [Scroll] Rotate | [ENTER] Confirm",
        help_text5 = "Hold [LBM] to cut glass",
        cancel = "Selection cancelled.",

        title_selector = "Position Selector",
        title_minigame = "Minigame Preview",
        precision_title = "Precision Editor",
        precision_help =
        "[Arrows] Move XY | [PgUp/PgDn] Height | [Scroll] Rotate | [ENTER] Confirm | [BACKSPACE] Cancel",

        select_entity = "Press [ENTER] to select this object",
        invalid_entity = "This is not a valid object!",
        success = "Position saved successfully!"
    },
    art_heist = {
        title = "Stealing Art",
        icon = "fa-solid fa-scissors"
    },
    glass_cutter = {
        title = 'Glas Cutter',
        icon = 'fa-solid fa-magnifying-glass',
    },
    target = {
        label_prefix = "Start: "
    },
    multiplayer = {
        waitingTitle = "Waiting",
        searchingPlayers = "Searching for players... Joined: %s",
        readyPlayers = "Players ready: %s",
        inviteTitle = "Robbery Invite",
        inviteMsg = "Player [%s] invites you. [Y] Accept | [X] Decline",
        notEnoughPlayers = "Not enough players nearby!",
        lobbyFull = "Lobby full! Press [Y] to start the robbery",
    },
    gruppe6 = {
        takeLoot = "Take Loot",
    },
    atm = {
        collectMoney = "Collect Money",
    },
}

Config.UITranslations = {
    sidebar = {
        title_suffix = "OS",
        title_prefix = "PLUTO",
        dashboard = "Dashboard",
        list = "Heists",
        close = "Exit"
    },
    dashboard = {
        title = "Status",
        welcome_title = "Welcome Agent",
        welcome_desc = "System ready.",
        stat_active = "Total Heists",
        stat_version = "Stable",
        stat_status = "Connected",
        version_label = "VERSION",
        core_label = "CORE",
        core_txt = "1.0.0",
        uptime_label = "UPTIME",
        uptime_txt = "100%",
        latency_label = "LATENCY",
        latency_txt = "0.2ms",
        quick_ops_title = "Quick Operations",
        new_heist_desc = "Initialize a new robbery creation",
        manage_desc = "Edit or delete existing heist templates"
    },
    list = {
        title = "Database",
        new_btn = "New Heist",
        edit_btn = "Edit",
        del_btn = "DELETE",
        empty_state_title = "No Heists",
        empty_state_desc = "Create your first heist.",
        premium_title = "TEMPLATE",
        premium_title_accent = "REGISTRY",
        premium_desc = "Manage and deploy heist configurations",
        item_type = "Heist Template"
    },
    editor = {
        save_btn = "Save and reload",
        import_btn = "Import",
        export_btn = "Export",
        cancel_btn = "Cancel",
        modal_export_title = "EXPORT DATA",
        modal_export_desc = "Copy the code below to share your setup.",
        modal_import_title = "IMPORT DATA",
        modal_import_desc = "Paste configuration JSON below.",
        btn_copy = "COPY TO CLIPBOARD",
        btn_copied = "COPIED",
        btn_load = "LOAD CONFIGURATION",
        palette_help = "Click to add",
        properties_title = "Properties",
        delete_node_btn = "Delete Node",
        start_node_desc = "Entry Point",
        click_to_edit = "Click to edit",
        default_heist_prefix = "Heist",
        default_new_suffix = "New",
        search_placeholder = "Search here...",
        library_title = "HEIST",
        library_title_light = "LIBRARY",
        library_desc = "MANAGE AND DEPLOY PRE-CONFIGURED HEISTS",
        fetch_coords = "FETCH COORDINATES"
    },
    notifications = {
        start_required = "Start node required!",
        missing_start_coords = "Start node needs coordinates!",
        coords_fetched = "Coordinates updated!",
        need = "Need at least one unlinked node with coords!",
        missing_coords = "Some nodes are missing coordinates! They are highlighted in red",
    },
    miniGames = {
        title_main = "PLUTO",
        title_sub = "OS",
        sec = "SEC",
        status_title = "CONDITION:",
        waiting = "INITIALIZING...",
        connecting = "CONNECTING: ",
        success = "CONNECTION ESTABLISHED",
        fail = "CONNECTION ERROR",
        win = "SUCCESS",
        lose = "ACCESS DENIED",

        target = "TARGET SEQ:",
        invalid_seq = "INVALID SEQUENCE",

        synchronising = "SYNCHRONIZING...",
        signal_lost = "SIGNAL LOST (-3s)",
        press_space = "PRESS [MOUSE] TO LOCK",
        lock_stage = "LOCK",

        voltage_target = "TARGET",
        voltage_current = "CURRENT",
        voltage_overflow = "VOLTAGE OVERLOAD",

        tumbler_correct = "TUMBLER LOCKED",
    },
    skilltree = {
        title_prefix = "SKILL",
        title_suffix = "TREE",
        points_label = "AVAILABLE POINTS",
        select_category_title = "SELECT CATEGORY",
        select_category_desc = "Manage your skills",
        nodes_count = "nodes",
        status = {
            locked = "Locked",
            unlocked = "Unlocked",
            cost = "COST",
            points_short = "PTS",
            click_to_unlock = "Click to unlock",
            req_prev = "Requires previous skill",
            req_failed = "Requirements not met",
            no_points = "Not enough points"
        }
    },
    computer = {
        icon_my_computer = "Files",
        icon_recycle_bin = "Recycle Bin",
        icon_cmd = "Terminal",
        icon_ie = "Internet Explorer",
        start_btn = "Start",

        browser_title = "Internet Explorer",
        browser_error_header = "The page cannot be displayed",
        browser_error_desc = "The page you are looking for is currently unavailable.",
        browser_error_code = "Error Code: 404",

        notepad_title = "Notepad",

        cmd_title = "Terminal",
        cmd_welcome_1 = "Hack the code...",
        cmd_welcome_2 = "(C) Terminal 2023-2026.",
        cmd_prompt_default = "C:/Users/Admin>",
        cmd_prompt_tool = "[OVERRIDE_TOOL]>",
        cmd_help_response = "Commands: DIR, CLS, EXIT, OVERRIDE",
        cmd_dir_header = " Directory of C:/Windows/System32",
        cmd_hack_hint = "'hack' is not recognized. Did you mean 'override'?",
        cmd_tool_loading = "Loading System Override Tool v2.0...",
        cmd_tool_loaded = "tool loaded successfully.",
        cmd_tool_auth = "Please enter authorization code to proceed.",
        cmd_verifying = "Verifying...",
        cmd_denied_msg = "Invalid code. Try again or type 'exit'.",
        cmd_exit_tool = "Exiting tool...",
        cmd_unknown = "is not recognized.",

        file_toolbar = "File  Edit  View  Help",
        file_back = "Up",
        file_address = "Address:",

        file_readme_name = "READ_ME.txt",
        file_readme_content =
        "SECURITY ALERT:\n\nTo access the mainframe, use the 'override' command in the terminal.\n\nAuthorization code is required. Check 'My Documents' for the daily key.",

        folder_my_docs = "My Documents",
        folder_private = "Private",
        folder_work = "Work",

        file_key_name = "daily_key.txt",
        file_key_content_prefix = "SYSTEM SECURITY V2\n------------------\nAUTH CODE:",

        file_notes_name = "notes.txt",
        file_notes_content = "Meeting at 5 PM.\nDon't forget to lock the PC.",

        recycle_msg = "Recycle Bin is empty.",
        msg_box_title = "Message"
    }
}
