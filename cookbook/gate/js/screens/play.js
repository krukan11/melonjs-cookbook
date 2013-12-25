game.PlayScreen = me.ScreenObject.extend({
				
	init:function(){		
			
		me.plugin.bag.create("right", 5 );			
		me.event.subscribe( "game.bag.onAddItem", this._onAddItem);		
		me.event.subscribe( "game.bag.onRemoveItem", this._onRemoveItem);
					
		// change the default sort property	
		me.game.world.sortOn = "y";											
	},
		
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {				
		me.levelDirector.loadLevel("part1");	
													
		me.game.onLevelLoaded = this.onLevelLoadedHandler.bind(this);	
		game.data.lastLevelName = me.levelDirector.getCurrentLevelId();
		
		this.placeArtefacts();					
	},
	
	/**
	 * on level loader handler
	 */
	onLevelLoadedHandler: function(e){
		this.mapSetting();	
		this.placeArtefacts();		              		       
	},
	
	/**
	 * Sets the position of the hero, depending on from what level the hero arrives.
	 */
	mapSetting:function(){
		var heroList = me.game.world.getEntityByProp("name", "hero");
		var doorInList = me.game.world.getEntityByProp("name", "doorIn");
																			
		for(var i = 0; i < doorInList.length; i++){
			if( game.data.lastLevelName == doorInList[i].from ){
				heroList[0].pos.x = doorInList[i].pos.x;
        		heroList[0].pos.y = doorInList[i].pos.y;	
        		break;
			}			
		}	
		
		game.data.lastLevelName = me.levelDirector.getCurrentLevelId();				
	},

	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		me.event.unsubscribe( "game.bag.onAddItem", this._onAddItem);		
		me.event.unsubscribe( "game.bag.onRemoveItem", this._onRemoveItem);			
	},
	
	/**
	 * Place artefacts to level
	 */
	placeArtefacts:function(){
		var artefacts = game.data.artefactsLocations[me.levelDirector.getCurrentLevelId()];
					
		for( var idx = 0; idx < artefacts.length; idx++ ){
			var artefact = me.entityPool.newInstanceOf( artefacts[idx].name, artefacts[idx].x, artefacts[idx].y, {name:artefacts[idx].name} );
			artefact.renderable.setCurrentAnimation( artefacts[idx].name );	
			me.game.add( artefact , 10);
		}							
	},
	
	/**
	 * Remove item from array
	 * @see game.data.artefactsLocations 
	 * @private
 	 * @param {Object} item
	 */
	_onAddItem:function( item ){		
		var artefacts = game.data.artefactsLocations[ me.levelDirector.getCurrentLevelId() ];				
		for( var idx = 0; idx < artefacts.length; idx++ ){
			if(item.name == artefacts[idx].name){
				artefacts.splice(idx, 1);				
				break;
			}
		}				
	},
	
	/**
	 * Add item to array
	 * @see game.data.artefactsLocations 
	 * @private
 	 * @param {Object} item
	 */
	_onRemoveItem:function(item){
		var artefacts = game.data.artefactsLocations[ me.levelDirector.getCurrentLevelId() ];
		artefacts.push( {name:item.name, x:item.pos.x, y:item.pos.y } );		
	},
});
