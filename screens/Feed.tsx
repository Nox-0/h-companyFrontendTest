import * as React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default class Feed extends React.Component{
	state = {
		mobdata: [],
		cowdata: [],
		timedata: [],
		complete: [],
	}

	getData = async () => {
		let h = new Headers();
		let mobreq = new Request('https://run.mocky.io/v3/5c17c252-743e-4110-a7f5-490785a9daa5', {
			headers: h,
			method: 'GET'
		})
		let cowreq = new Request('https://run.mocky.io/v3/464a7cd9-50ff-46a3-a861-83965b922298', {
			headers: h,
			method: 'GET'
		})
		let timereq = new Request('https://run.mocky.io/v3/18348203-bf01-4145-811a-296ee90d6a1f', {
			headers: h,
			method: 'GET'
		})
		fetch(mobreq)
			.then(res => res.json())
			.then(this.showMobData)
			.catch(err => console.log(err))
		fetch(cowreq)
			.then(res => res.json())
			.then(this.showCowData)
			.catch(err => console.log(err))
		fetch(timereq)
			.then(res => res.json())
			.then(this.showTimeData)
			.catch(err => console.log(err))

	}
	showMobData = (data: any) => {
		this.setState({mobdata: data})
	}
	showCowData = (data: any) => {
		this.setState({cowdata: data})
	}
	showTimeData = (data: any) => {
		this.setState({timedata: data})
	}
	componentDidMount() {
		this.getData();
	}

	formatComplete = () => {
		const mobList = this.state.mobdata;
		const cowList = this.state.cowdata;
		const timeList = this.state.timedata;
		const mergeCowMob = (cowList = [], mobList = []) => {
			let res = [];
			res = cowList.map(obj => {
				const index = mobList.findIndex(el => el["id"] == obj["mobId"]);
				const { name } = index !== 1 ? mobList[index] : {};
				return {
					...obj,
					name
				};
			});
			return res;
		};
		const mergeTimeCow = (timeList = [], cowList = []) => {
			let res = [];
			res = cowList.map(obj => {
				const index = cowList.findIndex(el => el["id"] == obj["cowId"]);
				if (cowList[index].color != null) {
					const { earTag } = index !== 1 ? cowList[index] : {};
					const { name } = index !== -1 ? cowList[index] : {};
				}
				return {
					...obj,
					earTag,
					name
				};
			});
			return res;
		};
		if (cowList.length > 0) {
			let thingy = mergeCowMob(cowList, mobList);
			// console.log(thingy);
			return thingy;
		}
		return [];
	}

	newMergeAttempt = () => {
		const mobList = this.state.mobdata;
		const cowList = this.state.cowdata;
		const timeList = this.state.timedata;
		let half: { earTag: any; }[] = [];
		let full = [];
		if (cowList.length > 0) {
			cowList.forEach(cow => {
				let mobId = cow.mobId - 1;
				let newObj = {
					id: cow.id,
					earTag: cow.earTag,
					name: mobList[mobId].name
				}
				half.push(newObj)
			})
		}
		if (timeList.length > 0 && half.length > 0) {
			let count = 0;
			timeList.forEach(time => {
				let cowInd = time.cowId -1;
				let newObj = {
					id: count,
					cowId: time.cowId,
					status: time.status,
					confirmedBy: time.confirmedBy,
					date: time.date,
					read: time.read,
					name: half[cowInd].name,
					earTag: half[cowInd].earTag
				}
				count ++;
				full.push(newObj);
			})
		}
		return full;
	}

	formatMob = (mob: any) => {
		if (mob.name == 'Milkers') {
			return (
				<Text style={styles.milker}>M, {mob.id}, {mob.color}</Text>
			)
		} else if (mob.name == 'Sick') {
			return (
				<Text style={styles.sick}>S, {mob.id}, {mob.color}</Text>
			)
		}
	}

	formatCow = (cow: any) => {
		return (
			<Text>{cow.id}, {cow.mobId}, {cow.earTag}</Text>
		)
	}

	formatTime = (time: any) => {
		return (
			<Text>{time.id}, {time.cowId}, {time.status}, {time.confirmedBy}, {time.date}, {time.read}</Text>
		)
	}

	formatHalf = (thing: any) => {
		return (
			<Text>{thing.id}, {thing.earTag}, {thing.name}</Text>
		)
	}

	formatFull = (thing: any) => {
		return (
			<Text>ID: {thing.id}, Ear tag: {thing.earTag}, Status: {thing.status}, Confirmed By: {thing.confirmedBy},
				Date: {thing.date}, Read: {thing.read}, Cow ID: {thing.cowId}, Name: {thing.name}</Text>
		)
	}

	render() {
		const hey = this.formatComplete();
		const full = this.newMergeAttempt();
		return (
			<ScrollView style={styles.container}>
				<Text style={styles.title}>Tab One</Text>
				{ this.state.cowdata && this.state.cowdata.length > 0 && (
					this.state.cowdata.map( cow => (
						this.formatCow(cow)
					))
				)}
				{ this.state.mobdata && this.state.mobdata.length > 0 && (
					this.state.mobdata.map( mob => (
						this.formatMob(mob)
					))
				)}
				{ full && full.length > 0 && (
					full.map( thing => (
						this.formatHalf(thing)
					))
				)}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 25,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	milker: {
		backgroundColor: "#3DBA4E",
		color: '#ffffff'
	},
	sick: {
		backgroundColor: "#D82833",
		color: '#fff',
	}
});
