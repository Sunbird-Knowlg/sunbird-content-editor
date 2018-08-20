describe('language service test cases', function () {
	beforeAll(function () {
		org.ekstep.services.config = {
			baseURL: org.ekstep.contenteditor.config.baseURL,
			apislug: org.ekstep.contenteditor.config.apislug
		}
	})

	it('should return languages on getLanguages method call', function () {
		var languages = '{"id":"ekstep.language.list","ver":"2.0","ts":"2017-03-21T13:28:12ZZ","params":{"resmsgid":"b66a5c03-3da6-4190-87c1-e604df5717af","msgid":null,"err":null,"status":"successful","errmsg":null},"responseCode":"OK","result":{"languages":[{"identifier":"lang_bn","code":"bn","isoCode":"bn","name":"Bengali","words":1,"lastUpdatedOn":"2017-01-29T17:56:07.004+0000","liveWords":0,"createdOn":"2016-04-13T10:40:14.753+0000","status":"Live","versionKey":"1485712567004"},{"identifier":"lang_en","code":"en","isoCode":"en","name":"English","words":90691,"lastUpdatedOn":"2017-01-29T17:56:19.669+0000","liveWords":-435899,"status":"Live","versionKey":"1485712579669"},{"identifier":"lang_gu","code":"gu","isoCode":"gu","name":"Gujarati","words":0,"lastUpdatedOn":"2017-01-29T17:56:29.803+0000","liveWords":0,"createdOn":"2016-04-13T10:42:16.856+0000","status":"Live","versionKey":"1485712589803"},{"identifier":"lang_hi","code":"hi","isoCode":"hi","name":"Hindi","words":95602,"lastUpdatedOn":"2017-01-29T17:56:43.158+0000","liveWords":-70312,"status":"Live","versionKey":"1485712603158"},{"identifier":"lang_ka","code":"ka","isoCode":"kn","name":"Kannada","words":34296,"lastUpdatedOn":"2017-01-29T17:56:56.049+0000","liveWords":-12319,"createdOn":"2016-02-05T08:33:58.518+0000","status":"Live","versionKey":"1485712616049"},{"identifier":"lang_mr","code":"mr","isoCode":"mr","name":"Marathi","words":0,"lastUpdatedOn":"2017-01-29T17:57:06.359+0000","liveWords":0,"createdOn":"2016-04-13T10:43:33.485+0000","status":"Live","versionKey":"1485712626359"},{"identifier":"lang_pa","code":"pa","isoCode":"pa","name":"Punjabi","words":0,"lastUpdatedOn":"2017-01-29T17:57:11.502+0000","liveWords":0,"createdOn":"2016-04-13T10:44:19.675+0000","status":"Live","versionKey":"1485712631502"},{"identifier":"lang_ta","code":"ta","isoCode":"ta","name":"Tamil","words":0,"lastUpdatedOn":"2017-01-29T17:57:24.937+0000","liveWords":0,"createdOn":"2016-04-13T10:44:44.849+0000","status":"Live","versionKey":"1485712644937"},{"identifier":"lang_te","code":"te","isoCode":"te","name":"Telugu","words":37541,"lastUpdatedOn":"2017-01-29T17:57:32.551+0000","liveWords":-135909,"createdOn":"2016-04-14T18:59:04.670+0000","status":"Live","versionKey":"1485712652551"}]}}'
		org.ekstep.services.languageService.get = jasmine.createSpy().and.callFake(function (url, headers, cb) {
			cb(undefined, languages)
		})
		spyOn(org.ekstep.services.languageService, 'getLanguages').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'getFromService').and.callThrough()
		// eslint-disable-next-line
		org.ekstep.services.languageService.getLanguages(function (err, res) {
			expect(res).toBe(languages)
			expect(org.ekstep.services.languageService.getFromService).toHaveBeenCalled()
			expect(org.ekstep.services.languageService.getFromService.calls.count()).toBe(1)
		})
	})

	it('should return error on getLanguages method call', function () {
		org.ekstep.services.languageService.get = jasmine.createSpy().and.callFake(function (url, headers, cb) {
			// eslint-disable-next-line
			cb('no data found', undefined)
		})
		spyOn(org.ekstep.services.languageService, 'getLanguages').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'getFromService').and.callThrough()
		org.ekstep.services.languageService.getLanguages(function (err, res) {
			expect(err).toBe('no data found')
			expect(org.ekstep.services.languageService.getFromService).toHaveBeenCalled()
			expect(org.ekstep.services.languageService.getFromService.calls.count()).toBe(1)
		})
	})

	it('should return vowels on getVowel method call', function () {
		var vowels = '{"id":"getAllVarnas","ver":"2.0","ts":"2017-03-16T05:19:23ZZ","params":{"resmsgid":"6d0757d3-3f9f-4d23-9dcd-8723c7c453b3","msgid":null,"err":null,"status":"successful","errmsg":null},"responseCode":"OK","result":{"result":[{"identifier":"OW","varna":"OW","isoSymbol":"ō","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"altIsoSymbol":"o","audio":null,"type":"Vowel","ipaSymbol":"ō","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"AA","varna":"AA","isoSymbol":"ā","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"altIsoSymbol":"ã","audio":null,"type":"Vowel","ipaSymbol":"ā","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"UH","varna":"UH","isoSymbol":"u","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/U.mp3","type":"Vowel","ipaSymbol":"u","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"AE","varna":"AE","isoSymbol":"ê","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"altIsoSymbol":"e","audio":null,"type":"Vowel","ipaSymbol":"e","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"UW","varna":"UW","isoSymbol":"ū","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":null,"type":"Vowel","ipaSymbol":"ū","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"AW","varna":"AW","isoSymbol":"au","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/AU.mp3","type":"Vowel","ipaSymbol":"au","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"AY","varna":"AY","isoSymbol":"ai","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/AI.mp3","type":"Vowel","ipaSymbol":"ai","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"AH","varna":"AH","isoSymbol":"a","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/A.mp3","type":"Vowel","ipaSymbol":"a","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"AO","varna":"AO","isoSymbol":"ô","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"altIsoSymbol":"o","audio":null,"type":"Vowel","ipaSymbol":"ō","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"EY","varna":"EY","isoSymbol":"ey","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"altIsoSymbol":"e","audio":null,"type":"Vowel","ipaSymbol":"ey","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"EH","varna":"EH","isoSymbol":"e","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/E.mp3","type":"Vowel","ipaSymbol":"e","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"IH","varna":"IH","isoSymbol":"i","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/I.mp3","type":"Vowel","ipaSymbol":"i","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"IY","varna":"IY","isoSymbol":"ī","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":null,"type":"Vowel","ipaSymbol":"ī","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"}]}}'
		org.ekstep.services.languageService.get = jasmine.createSpy().and.callFake(function (url, headers, cb) {
			cb(undefined, vowels)
		})
		spyOn(org.ekstep.services.languageService, 'getVowel').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'getFromService').and.callThrough()
		// eslint-disable-next-line
		org.ekstep.services.languageService.getVowel('en', function (err, res) {
			expect(res).toBe(vowels)
			expect(org.ekstep.services.languageService.getFromService).toHaveBeenCalled()
			expect(org.ekstep.services.languageService.getFromService.calls.count()).toBe(1)
		})
	})

	it('should return error on getVowel method call', function () {
		org.ekstep.services.languageService.get = jasmine.createSpy().and.callFake(function (url, headers, cb) {
			// eslint-disable-next-line
			cb('no data found', undefined)
		})
		spyOn(org.ekstep.services.languageService, 'getVowel').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'getFromService').and.callThrough()
		org.ekstep.services.languageService.getVowel('en', function (err, res) {
			expect(err).toBe('no data found')
			expect(org.ekstep.services.languageService.getFromService).toHaveBeenCalled()
			expect(org.ekstep.services.languageService.getFromService.calls.count()).toBe(1)
		})
	})

	it('should return consonants on getConsonant method call', function () {
		var consonants = '{"id":"getAllVarnas","ver":"2.0","ts":"2017-03-16T05:50:01ZZ","params":{"resmsgid":"36c9f819-aa33-48f4-be53-93ac5c3d1010","msgid":null,"err":null,"status":"successful","errmsg":null},"responseCode":"OK","result":{"result":[{"identifier":"OY","varna":"OY","isoSymbol":"ô+y","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","altIsoSymbol":"o+y","type":"Consonant","ipaSymbol":"ōy","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"N","varna":"N","isoSymbol":"n","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/NA.mp3","type":"Consonant","ipaSymbol":"n","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"NG","varna":"NG","isoSymbol":"ṁg","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"altIsoSymbol":"ṃ+g","audio":null,"type":"Consonant","ipaSymbol":"ṁg","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"S","varna":"S","isoSymbol":"s","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/SA.mp3","type":"Consonant","ipaSymbol":"s","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"SH","varna":"SH","isoSymbol":"ṣ","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":null,"type":"Consonant","ipaSymbol":"ṣ","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"P","varna":"P","isoSymbol":"p","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/PA.mp3","type":"Consonant","ipaSymbol":"p","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"R","varna":"R","isoSymbol":"r","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/RA.mp3","type":"Consonant","ipaSymbol":"r","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"T","varna":"T","isoSymbol":"ṭ","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":null,"type":"Consonant","ipaSymbol":"ṭ","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"TH","varna":"TH","isoSymbol":"th","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/THA.mp3","type":"Consonant","ipaSymbol":"th","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"Y","varna":"Y","isoSymbol":"y","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/YA.mp3","type":"Consonant","ipaSymbol":"y","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"Z","varna":"Z","isoSymbol":"z","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"altIsoSymbol":"j","audio":null,"type":"Consonant","ipaSymbol":"j","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"V","varna":"V","isoSymbol":"v","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/VA.mp3","type":"Consonant","ipaSymbol":"v","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"W","varna":"W","isoSymbol":"v","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/VA.mp3","type":"Consonant","ipaSymbol":"v","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"ZH","varna":"ZH","isoSymbol":"ś","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":null,"type":"Consonant","ipaSymbol":"ś","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"D","varna":"D","isoSymbol":"ḍ","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":null,"type":"Consonant","ipaSymbol":"ḍ","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"DH","varna":"DH","isoSymbol":"d","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/DA.mp3","type":"Consonant","ipaSymbol":"d","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"B","varna":"B","isoSymbol":"b","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/BA.mp3","type":"Consonant","ipaSymbol":"b","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"CH","varna":"CH","isoSymbol":"ch","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/CHA.mp3","type":"Consonant","ipaSymbol":"ch","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"F","varna":"F","isoSymbol":"f","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"altIsoSymbol":"ph","audio":null,"type":"Consonant","ipaSymbol":"f","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"ER","varna":"ER","isoSymbol":"er","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"altIsoSymbol":"a+r","audio":null,"type":"Consonant","ipaSymbol":"er","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"G","varna":"G","isoSymbol":"g","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/GA.mp3","type":"Consonant","ipaSymbol":"g","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"HH","varna":"HH","isoSymbol":"h","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/HA.mp3","type":"Consonant","ipaSymbol":"h","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"L","varna":"L","isoSymbol":"l","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/LA.mp3","type":"Consonant","ipaSymbol":"l","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"M","varna":"M","isoSymbol":"m","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/MA.mp3","type":"Consonant","ipaSymbol":"m","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"JH","varna":"JH","isoSymbol":"j","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/JA.mp3","type":"Consonant","ipaSymbol":"j","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"},{"identifier":"K","varna":"K","isoSymbol":"k","lastUpdatedOn":"2016-11-09T17:13:03.266+0000","phonoAttribVector":null,"audio":"https://s3-ap-southeast-1.amazonaws.com/ekstep-public/akshara_assets/ipa_sounds/KA.mp3","type":"Consonant","ipaSymbol":"k","createdOn":"2016-05-11T07:04:02.348+0000","status":"Live"}]}}'
		org.ekstep.services.languageService.get = jasmine.createSpy().and.callFake(function (url, headers, cb) {
			cb(undefined, consonants)
		})
		spyOn(org.ekstep.services.languageService, 'getConsonant').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'getFromService').and.callThrough()
		// eslint-disable-next-line
		org.ekstep.services.languageService.getConsonant('en', function (err, res) {
			expect(res).toBe(consonants)
			expect(org.ekstep.services.languageService.getFromService).toHaveBeenCalled()
			expect(org.ekstep.services.languageService.getFromService.calls.count()).toBe(1)
		})
	})

	it('should return error on getConsonant method call', function () {
		org.ekstep.services.languageService.get = jasmine.createSpy().and.callFake(function (url, headers, cb) {
			// eslint-disable-next-line
			cb('no data found', undefined)
		})
		spyOn(org.ekstep.services.languageService, 'getConsonant').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'getFromService').and.callThrough()
		org.ekstep.services.languageService.getConsonant('en', function (err, res) {
			expect(err).toBe('no data found')
			expect(org.ekstep.services.languageService.getFromService).toHaveBeenCalled()
			expect(org.ekstep.services.languageService.getFromService.calls.count()).toBe(1)
		})
	})

	it('should return words on getWords method call', function () {
		var words = '{"id":"langugeSearch","ver":"2.0","ts":"2017-03-22T10:38:14ZZ","params":{"resmsgid":"a426241e-c7b0-4b43-b126-625cdf710672","msgid":null,"err":null,"status":"successful","errmsg":null},"responseCode":"OK","result":{"count":2,"words":[{"lemma":"beautiful","objectType":"Word","wordLists":["ESL"],"meaning":"of a very high standard; excellent.","word_complexity":1.3,"ekstepWordnet":false,"lastUpdatedOn":"2017-02-17T12:27:41.774+0000","identifier":"en_30205590","morphology":false,"syllableCount":9,"primaryMeaningId":"en_11217698647950950411","exampleSentences":["The little girl is very beautiful","what a beautiful day"],"graph_id":"en","nodeType":"DATA_NODE","wordListIds":["en_30205591"],"grade":["1"],"thresholdLevel":"1","synsetCount":2,"isPhrase":false,"category":"Concept","status":"Live","node_id":148411,"synonyms":["en_11217698647950950411","en_11217700517629952012"],"wordsets":["en_10207028","en_20205756","en_10206483"],"syllables":["b y ū","ṭ a","f a","l"],"es_metadata_id":"en_30205590","score":111},{"identifier":"143785","morphology":false,"sources":["IndoWordnet"],"sourceTypes":["wordnets"],"syllableCount":7,"primaryMeaningId":"en_112189129146933248144","lemma":"welcome","graph_id":"en","nodeType":"DATA_NODE","objectType":"Word","pos":["verb"],"meaning":"coming .........","ekstepWordnet":false,"word_complexity":1.1,"synsetCount":2,"thresholdLevel":"1","isPhrase":false,"lastUpdatedOn":"2017-02-24T10:07:34.942+0000","status":"Live","node_id":88478,"hasSynonyms":true,"hasAntonyms":true,"grade":["1"],"category":"Thing","tags":["come people"],"synonyms":["en_112189129146933248144","en_112189129153298432145"],"syllables":["v e","l k a","m"],"wordsets":["en_10206544","en_20205836","en_20205844"],"es_metadata_id":"143785","score":111}]}}'
		var requestObj = '{"request": {"filters": {},"exists": ["pictures", "pronunciations"]}}'
		org.ekstep.services.languageService.post = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			cb(undefined, words)
		})
		spyOn(org.ekstep.services.languageService, 'getWords').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'postFromService').and.callThrough()
		// eslint-disable-next-line
		org.ekstep.services.languageService.getWords(requestObj, function (err, res) {
			expect(res).toBe(words)
			expect(org.ekstep.services.languageService.postFromService).toHaveBeenCalled()
			expect(org.ekstep.services.languageService.postFromService.calls.count()).toBe(1)
		})
	})

	it('should return error on getWords method call', function () {
		var requestObj = '{"request": {"filters": {},"exists": ["pictures", "pronunciations"]}}'
		org.ekstep.services.languageService.post = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			// eslint-disable-next-line
			cb('no data found', undefined)
		})
		spyOn(org.ekstep.services.languageService, 'getWords').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'postFromService').and.callThrough()
		org.ekstep.services.languageService.getWords(requestObj, function (err, res) {
			expect(err).toBe('no data found')
			expect(org.ekstep.services.languageService.postFromService).toHaveBeenCalled()
			expect(org.ekstep.services.languageService.postFromService.calls.count()).toBe(1)
		})
	})

	it('should return wordDefinition on getWordDefinition method call', function () {
		var words = '{"id":"ekstep.definition.find","ver":"1.0","ts":"2017-03-22T10:40:31ZZ","params":{"resmsgid":"c943a624-7fb5-4a8e-a8a8-11dfd4599e2e","msgid":null,"err":null,"status":"successful","errmsg":null},"responseCode":"OK","result":{"definition_node":{"identifier":"DEFINITION_NODE_Word","objectType":"Word","properties":[{"required":true,"dataType":"Text","propertyName":"lemma","title":"Word","description":"","category":"general","displayProperty":"Editable","range":[],"defaultValue":"","renderingHints":"{ "order": 1 }","indexed":true,"draft":false},{"required":false,"dataType":"Boolean","propertyName":"ekstepWordnet","title":"EkStep Wordnet","description":"","category":"general","displayProperty":"Editable","range":[],"defaultValue":"false","renderingHints":"{ "order": 2 }","indexed":true,"draft":false}],"inRelations":[{"relationName":"synonym","objectTypes":["Synset"],"title":"synonyms","description":"","required":false,"renderingHints":"{ "order": 26 }"},{"relationName":"hasMember","objectTypes":["WordSet"],"title":"wordsets","description":"","required":false,"renderingHints":"{ "order": 27 }"}],"outRelations":[{"relationName":"hasAntonym","objectTypes":["Word"],"title":"antonyms","description":"","required":false,"renderingHints":"{ "order": 26 }"},{"relationName":"hasHypernym","objectTypes":["Word"],"title":"hypernyms","description":"","required":false,"renderingHints":"{ "order": 26 }"},{"relationName":"hasHolonym","objectTypes":["Word"],"title":"holonyms","description":"","required":false,"renderingHints":"{ "order": 26 }"},{"relationName":"hasHyponym","objectTypes":["Word"],"title":"hyponyms","description":"","required":false,"renderingHints":"{ "order": 26 }"},{"relationName":"hasMeronym","objectTypes":["Word"],"title":"meronyms","description":"","required":false,"renderingHints":"{ "order": 26 }"}],"systemTags":[{"name":"Review Tags","description":"Need to Review this Word."},{"name":"Missing Information","description":"Some the information is missing."},{"name":"Incorrect Data","description":"Wrong information about this word."},{"name":"Spelling Mistakes","description":"Incorrect Spellings"}],"metadata":{"weightages":"{}","renderingHints":"{ "inputType": "textarea", "order": 13 }","ttl":24,"createdOn":"2016-02-10T12:35:30.200+0000","versionKey":"1483010268554","limit":50,"lastUpdatedOn":"2016-12-29T16:47:48.554+0530"}}}}'
		org.ekstep.services.languageService.get = jasmine.createSpy().and.callFake(function (url, headers, cb) {
			cb(undefined, words)
		})
		spyOn(org.ekstep.services.languageService, 'getWordDefinition').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'getFromService').and.callThrough()
		// eslint-disable-next-line
		org.ekstep.services.languageService.getWordDefinition(function (err, res) {
			expect(res).toBe(words)
			expect(org.ekstep.services.languageService.getFromService).toHaveBeenCalled()
			expect(org.ekstep.services.languageService.getFromService.calls.count()).toBe(1)
		})
	})

	it('should return error on getWordDefinition method call', function () {
		org.ekstep.services.languageService.get = jasmine.createSpy().and.callFake(function (url, headers, cb) {
			// eslint-disable-next-line
			cb('no data found', undefined)
		})
		spyOn(org.ekstep.services.languageService, 'getWordDefinition').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'getFromService').and.callThrough()
		org.ekstep.services.languageService.getWordDefinition(function (err, res) {
			expect(err).toBe('no data found')
			expect(org.ekstep.services.languageService.getFromService).toHaveBeenCalled()
			expect(org.ekstep.services.languageService.getFromService.calls.count()).toBe(1)
		})
	})

	it('should return keyWords on getKeyWords method call', function () {
		var keywords = '{"id":"ekstep.parser","ver":"1.0","ts":"2017-03-21T17:02:53ZZ","params":{"resmsgid":"3688ad99-28b2-45cf-8c2c-011314db9802","msgid":"e9308155-8d66-4ecf-8fa6-2fa4927a91a9","err":null,"status":"successful","errmsg":null},"responseCode":"OK","result":{"the":{},"pen":{"equivalentWords":["scooper","stylus","quill"]},"then":{}}}'
		var requestData = '{"request": { "language_id": "en","wordSuggestions": true,"relatedWords": true,"translations": true,"equivalentWords": true,"content": "Then pen is mightier then the sward"}}'
		org.ekstep.services.languageService.post = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			cb(undefined, keywords)
		})
		spyOn(org.ekstep.services.languageService, 'getKeyWords').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'postFromService').and.callThrough()
		// eslint-disable-next-line
		org.ekstep.services.languageService.getKeyWords(requestData, function (err, res) {
			expect(res).toBe(keywords)
			expect(org.ekstep.services.languageService.postFromService).toHaveBeenCalled()
			expect(org.ekstep.services.languageService.postFromService.calls.count()).toBe(1)
		})
	})

	it('should return error on getKeyWords method call', function () {
		var requestData = '{"request": { "language_id": "en","wordSuggestions": true,"relatedWords": true,"translations": true,"equivalentWords": true,"content": "Then pen is mightier then the sward"}}'
		org.ekstep.services.languageService.post = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			// eslint-disable-next-line
			cb('no data found', undefined)
		})
		spyOn(org.ekstep.services.languageService, 'getKeyWords').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'postFromService').and.callThrough()
		org.ekstep.services.languageService.getKeyWords(requestData, function (err, res) {
			expect(err).toBe('no data found')
			expect(org.ekstep.services.languageService.postFromService).toHaveBeenCalled()
			expect(org.ekstep.services.languageService.postFromService.calls.count()).toBe(1)
		})
	})

	it('getTransliteration method should call postFromService', function () {
		org.ekstep.services.languageService.post = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			// eslint-disable-next-line
			cb('no data found', undefined)
		})
		var data = { text: 'hello', languages: 'hindi' }
		spyOn(org.ekstep.services.languageService, 'getTransliteration').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'postFromService').and.callThrough()
		org.ekstep.services.languageService.getTransliteration(data, function (err, res) {
			expect(err).toBe('no data found')
			expect(org.ekstep.services.languageService.postFromService).toHaveBeenCalled()
		})
	})

	it('getTranslation method should call postFromService', function () {
		org.ekstep.services.languageService.post = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			// eslint-disable-next-line
			cb('no data found', undefined)
		})
		var data = { text: 'hello', languages: 'hindi' }
		spyOn(org.ekstep.services.languageService, 'getTransliteration').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'postFromService').and.callThrough()
		org.ekstep.services.languageService.getTranslation(data, function (err, res) {
			expect(err).toBe('no data found')
			expect(org.ekstep.services.languageService.postFromService).toHaveBeenCalled()
		})
	})

	it('getSyllables method should call postFromService with no word', function () {
		var error = '{"id":"ekstep.language.varnas.syllables.list","ver":"3.0","ts":"2017-07-27T09:04:51ZZ","params":{"resmsgid":"902632f8-900e-44a2-853f-8301db17e7e2","msgid":null,"err":"ERR_SCRIPT_ERROR","status":"failed","errmsg":"Unable to read response: 0"},"responseCode":"SERVER_ERROR","result":{}}'
		org.ekstep.services.languageService.post = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			cb(error, undefined)
		})
		var data = {
			'request': {
				'word': ''
			}
		}
		spyOn(org.ekstep.services.languageService, 'getSyllables').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'postFromService').and.callThrough()
		org.ekstep.services.languageService.getSyllables(data, function (err, res) {
			expect(err).toBe(error)
			expect(org.ekstep.services.languageService.postFromService).toHaveBeenCalled()
		})
	})

	it('getSyllables method should call postFromService', function () {
		var words = '{"id": "ekstep.language.varnas.syllables.list","ver": "3.0","ts": "2017-07-27T07:01:13ZZ","params": {"resmsgid": "6a1ebab7-f4ad-42a6-9c54-0ea65576051f","msgid": null,"err": null,"status": "successful","errmsg": null},"responseCode": "OK","result": {"result": ["कु","त्ता"]}}'
		org.ekstep.services.languageService.post = jasmine.createSpy().and.callFake(function (url, data, headers, cb) {
			cb(null, words)
		})
		var data = {
			'request': {
				'word': 'कुत्ता'
			}
		}
		spyOn(org.ekstep.services.languageService, 'getSyllables').and.callThrough()
		spyOn(org.ekstep.services.languageService, 'postFromService').and.callThrough()
		// eslint-disable-next-line
		org.ekstep.services.languageService.getSyllables(data, function (err, res) {
			console.log(res)
			expect(res).toBe(words)
			expect(org.ekstep.services.languageService.postFromService).toHaveBeenCalled()
			expect(org.ekstep.services.languageService.postFromService.calls.count()).toBe(1)
		})
	})
})
