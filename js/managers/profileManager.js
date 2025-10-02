/*
* Profile Manager - User profile management
*/
var profileManager = {
	getProfiles: () => {
		// get profiles list
		let listeProfiles = [];
		let listeProfilesString = window.localStorage.getItem('wodProfiles');
		if (listeProfilesString) {
			listeProfiles = JSON.parse(listeProfilesString);
		}
		return listeProfiles;
	},
	getCurrentProfileName: () => {
		// get current profile name
		let currentProfileName = window.localStorage.getItem('currentWodProfile');
		if (!currentProfileName) currentProfileName = 'defaultProfile';
		return currentProfileName;
	},
	getCurrentProfile: () => {
		// get profiles list
		let listeProfiles = profileManager.getProfiles();
		let currentProfileName = profileManager.getCurrentProfileName();

		// get current profile value. Create if necessary
		let currentProfile = profileManager.getProfile(currentProfileName);
		if (!currentProfile) {
			currentProfile = {
				'name': currentProfileName,
				'content': {}
			};
			listeProfiles.push(currentProfile);
			window.localStorage['wodProfiles'] = JSON.stringify(listeProfiles);
		}
		return currentProfile;
	},
	writeCurrentProfile: (key, value) => {
		// get profiles
		let listeProfiles = profileManager.getProfiles();
		let currentProfileName = profileManager.getCurrentProfileName();
		
		// update value
		listeProfiles.forEach((profile, index) => {
			if (profile.name==currentProfileName) {
				listeProfiles[index].content[key] = value;
			}
		});

		// write profiles data
		window.localStorage['wodProfiles'] = JSON.stringify(listeProfiles);
	},
	getProfile: (name) => {
		let listeProfiles = profileManager.getProfiles();
		let existingProfile = listeProfiles.find((p) => {if (p.name == name) return true;});
		return existingProfile;
	},
	createNewProfile: (login, pwd) => {
		let result = $.Deferred();
		let erreur = false;
		if ((!login) || (login=='')) {
			result.reject("Login incorrect");
			erreur = true;
		}
		if ((!pwd) || (pwd=='')) {
			result.reject("Password incorrect");
			erreur = true;
		}
		if (!erreur)
		{
			let existingProfile = profileManager.getProfile(login);
			if (existingProfile) {
				result.reject("Profile déjà existant");
			}
			else {
				let newLogin = new Login(login, pwd, new Date());
				let newProfile = {
					'name': login,
					'content': {},
					'loginInfos': newLogin
				}
				let listeProfiles = profileManager.getProfiles();
				listeProfiles.push(newProfile);
				window.localStorage['wodProfiles'] = JSON.stringify(listeProfiles);
				result.resolve();
			}
		}
		return result.promise();
	},
	connectProfile: (login, pwd) => {
		let result = $.Deferred();
		let erreur = false;
		// get profile & check pwd
		let existingProfile = profileManager.getProfile(login);
		if (!existingProfile) {
			result.reject("Profile inexistant");
			erreur = true;
		}
		// check pwd
		if (!erreur && existingProfile.loginInfos) {
			if (existingProfile.loginInfos.password!=pwd) {
				result.reject("Password incorrect");	
				erreur = true;
			}
		}
		// set current profile
		if (!erreur) {
			window.localStorage['currentWodProfile'] = login;
			result.resolve();	
		}		
		return result.promise();
	},
	disconnectProfile: () => {
		window.localStorage.removeItem('currentWodProfile');
	},
	getLoginStatus: () => {
		let currentProfileName = window.localStorage['currentWodProfile'];
		if (currentProfileName)
			return 'connected';
		else
			return 'disconnected';
	},
	restoreProfile: (data) => {
		let result = $.Deferred();
		try {
			let jsonData = atob(data);
			let importedProfile = JSON.parse(jsonData);
			let found = false;
			
			// profiles and replace with imported
			let listeProfiles = profileManager.getProfiles();			
			listeProfiles.forEach((profile, index) => {
				if (profile.name==importedProfile.name) {
					listeProfiles[index] = importedProfile;
					found = true;
				}
			});
			// if !found, add data & save
			if (!found) listeProfiles.push(importedProfile);
			window.localStorage['wodProfiles'] = JSON.stringify(listeProfiles);
			
			result.resolve();
		}
		catch(erreur) {
			result.reject(erreur);
		}
		return result.promise();
	},
	restoreProfiles: (data) => {
		let result = $.Deferred();
		try {
			let jsonData = atob(data);
			let importedProfiles = JSON.parse(jsonData);		
			window.localStorage['wodProfiles'] = JSON.stringify(importedProfiles);
			result.resolve(importedProfiles.length);
		}
		catch(erreur) {
			result.reject(erreur);
		}
		return result.promise();
	}
};