import * as React from 'react';
import {StyleSheet, Text, View, ScrollView, Pressable, Button, TouchableHighlight, Alert, Modal} from 'react-native';



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

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	}

	formatName = (mobName: string) => {
		if (mobName == "Milkers") {
			return (<View style={styles.milker}><Text style={styles.milker}>M</Text></View>)
		} else {
			return (<View style={styles.sick}><Text style={styles.sick}>S</Text></View>)
		}
	}

	formatStatus = (cowStatus: string, confirmer: string, readStatus: boolean) => {
		if (cowStatus == "unconfirmed") {
			return (
				<View>
					<Text style={readStatus ? styles.readHead : styles.unreadHead}>Potential illness</Text>
					<Text style={readStatus ? styles.readBody : styles.unreadBody}>Unconfirmed</Text>
				</View>
			)
		} else if (cowStatus == "sick") {
			return (
				<View>
					<Text style={readStatus ? styles.read : styles.unreadHead}>Lame</Text>
					<Text style={readStatus ? styles.read : styles.unreadBody}>Confirmed by {confirmer}</Text>
				</View>
			)
		} else {
			return (
				<View>
					<Text style={readStatus ? styles.read : styles.unreadHead}>Not sick</Text>
					<Text style={readStatus ? styles.read : styles.unreadBody}>Confirmed by {confirmer}</Text>
				</View>
			)
		}
	}

	formatEarTag = (earTag: string) => {
		return (
			<View style={styles.earTag}>
				<Text style={styles.earTag}>{earTag}</Text>
			</View>
		)
	}

	dateBanner = (entry) => {
	if (entry.id == 1 || this.state.timedata[entry.id - 2].date != entry.date) {
			return (
				<View style={styles.dateBanner} accessibilityRole={'summary'}>
					<Text style={styles.dateBanner}>
						{entry.date}
					</Text>
				</View>
			)
		}
	}

	test = () => {
		const { modalVisible } = this.state.modalVisible;
		if (this.state.timedata.length > 0 && this.state.cowdata.length > 0 && this.state.mobdata.length > 0) {
			let thing = this.state.timedata.map((entry) => {
				entry.cow = this.state.cowdata.filter((cow) => cow.id == entry.cowId);
				if (entry.cow != null && this.state.mobdata.length > 0) {
					entry.cow[0].mob = this.state.mobdata.filter((mob) => mob.id == entry.cow[0].mobId);
					return (
						<View>
							<Text>
								{this.dateBanner(entry)}
							</Text>
							<Pressable onPress={() => this.setModalVisible(true)}>
								<View style={styles.wholeThing}>
									<View style={styles.leftThing}><Text>{this.formatName(entry.cow[0].mob[0].name)} {this.formatEarTag(entry.cow[0].earTag)}</Text></View>
									<Text style={styles.rightThing}>{this.formatStatus(entry.status, entry.confirmedBy, entry.read)}</Text>
								</View>
							</Pressable>
						</View>
					);
				}
				return;
			});
			return thing;
		}
	}

render() {
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
	milker: {
		backgroundColor: '#3DBA4E',
		color: '#ffffff',
		padding: 7,
		paddingHorizontal: 9,
		borderRadius: 100,
	},
	sick: {
		backgroundColor: '#D82833',
		color: '#fff',
		padding: 7,
		paddingHorizontal: 10,
		borderRadius: 100,
	},
	card: {
		margin: 10,
	},
	read: {
		color: 'black',
	},
	unreadHead: {
		color: 'black',
		fontWeight: 'bold',
	},
	unreadBody: {
		color: 'red',
		fontWeight: 'bold',
	},
	earTag: {
		padding: 4,
		fontWeight: 'bold',
		fontSize: 20,
	},
	dateBanner: {
		padding: 5,
		backgroundColor: '#e8e8e8',
		fontWeight: 'bold',
		width: 1000,
	},
	leftThing: {
		width: 123,
		margin: 5,
	},
	rightThing: {
		margin: 5,
		paddingTop: 5,
	},
	wholeThing: {
		flex: 1,
		flexDirection: 'row',
	}
});
