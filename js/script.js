let listUsers = {
	startLoad: function(){
		this.rewriteServerData();
		this.compileDataTags();
		this.compileDataListUsers();
	},
	rewriteServerData: function(){
		if(serverData.length){
			for(let i = 0; i < serverData.length; i++){	
				let name = serverData[i].name;
				serverData[i].name = name.first + ' ' + name.last;
			}
		}
	},
	compileDataTags: function(){
		let tagsData = [];
		for(let a = 0; a < serverData.length; a++){
			for(let b = 0; b < serverData[a].tags.length; b++){
			let intTagsData = tagsData.length
				if(intTagsData <= 0){
					tagsData.push(serverData[a].tags[b]);
				} else {
					let ind = true;
					for (let c = 0; c < intTagsData; c++) {
						if(serverData[a].tags[b] === tagsData[c]){
							ind = false;
							break;
						}
					}
					if(ind){
						tagsData.push(serverData[a].tags[b]);
					}
				}
			}
		}
		let tplReadyTags = this.loadTemplate('filter-tags_tpl', tagsData);
		$('#filter-tags_js').html(tplReadyTags);
	},
	compileDataListUsers: function(){
		let localServerData = serverData,
			compileSearchInput = function(){
				let valSearchInput = $('#search-input_js').val(),
		 			valSearchSelect = $('#search-select_js').val();
				if(valSearchInput){
					let localData = [];
					for(let i = 0; i < localServerData.length; i++){
						if(localServerData[i][valSearchSelect].indexOf(valSearchInput) >= 0) {
							localData.push(localServerData[i]);
			 			}
					}
			 		localServerData = localData;
			 	}
			 	compileFilterActiv();
			},		 	
		 	compileFilterActiv = function(){
				let valFilterActiv = $('#filter-activ_js').val();
				if(valFilterActiv){
					let localData = [];
					for(let i = 0; i < localServerData.length; i++){
						if(localServerData[i].isActive) {
							localData.push(localServerData[i]);
						}
					}
					localServerData = localData;
				}
			 	compileFilterTags();
		 	},
		 	compileFilterTags = function(){
		 		let valFilterTags = $('#filter-tags_js').val();
		 		if(valFilterTags){
					let localData = [];
					for(let a = 0; a < localServerData.length; a++){
						for(let b = 0; b < localServerData[a].tags.length; b++){
							if(valFilterTags === localServerData[a].tags[b]){
								localData.push(localServerData[a]);
								break;
							}
						}
					}
					localServerData = localData;
	 			}
			 	compileDataTpl();
		 	},
		 	compileDataTpl = function(){
				objData = [],
			 	tplReadyList = null;
				for(let i = 0; i < localServerData.length; i++){
					let locData = localServerData[i];
					objData.push({
						num: i + 1,
						name: locData.name,
						email: locData.email,
						phone: locData.phone,
						friends: locData.friends.length,
						id: locData._id
					});
				}
				tplReadyList = listUsers.loadTemplate('list-users_tpl', objData);
				$('#list-users_js').html(tplReadyList);
			};
		compileSearchInput();
		$('.more-info_js').click(function(){
			listUsers.infoUser.mainCompile(this);
		});
	},
	infoUser: {
		mainCompile: function(selector){
			let itemId = $(selector).data('id'),
				dataTpl = null;
			for(let i = 0; i < serverData.length; i++){
				if(itemId === serverData[i]._id){
					let locData = serverData[i];
					dataTpl = [
						{title: 'name', content: locData.name},
						{title: 'age', content: locData.age}, 
						{title: 'email', content: locData.email},
						{title: 'phone', content: locData.phone},
						{title: 'address', content: locData.address},
						{title: 'company', content: locData.company},
						{title: 'greeting', content: locData.greeting},
						{title: 'registered', content: locData.registered},
						{title: 'friends', content: this.friendsCompile(locData.friends)},
						{title: 'picture', content: locData.picture},
						{title: 'tags', content: this.tagsCompile(locData.tags)},
						{title: 'isActive', content: locData.isActive},
						{title: 'id', content: locData._id},
						{title: 'guid', content: locData.guid}
					];
					break;
				}
			}
			let tplReady = listUsers.loadTemplate('pop-up_tpl', dataTpl);
			$('#pop-up_js').html(tplReady);
			$('#exampleModal').arcticmodal();
		},
		friendsCompile: function(data){
			let listFriends = '';
			for(let i = 0; i < data.length; i++){
				if(i > 0){
					listFriends += ', ';	
				}
				listFriends += data[i].name;
			}
			return listFriends;
		},
		tagsCompile: function(data){
			let listTags = '';
			for(let i = 0; i < data.length; i++){
				if(i > 0){
					listTags += ', ';	
				}
				listTags += data[i];
			}
			return listTags;
		}
	},
	loadTemplate: function(idTemplate, objData){
		let template = Handlebars.compile($('#'+idTemplate).html());
		return template(objData);
	}
}
$( document ).ready(function() {
	listUsers.startLoad();
	$('#search-input_js').on('input', function(){
		listUsers.compileDataListUsers();
	});
	$('#search-select_js, #filter-activ_js, #filter-tags_js').change(function(){
		listUsers.compileDataListUsers();
	});
});