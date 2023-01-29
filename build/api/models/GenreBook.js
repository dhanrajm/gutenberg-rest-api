import debug from "debug";
import { DataTypes, Model } from "sequelize";
import db from "../../db";
const log = debug("api:models:GenreBook");
export class GenreBookModel extends Model {
}
export default class GenreBookRecord {
    static init() {
        GenreBookModel.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            book_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            subject_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            tableName: "books_book_subjects",
            timestamps: false,
            underscored: true,
            sequelize: db.getDriver(),
        });
        log('done');
    }
    static addRelationships() { }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VucmVCb29rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9tb2RlbHMvR2VucmVCb29rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMxQixPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBYSxNQUFNLFdBQVcsQ0FBQztBQUN4RCxPQUFPLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFFMUIsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFMUMsTUFBTSxPQUFPLGNBQWUsU0FBUSxLQUFLO0NBQUc7QUFFNUMsTUFBTSxDQUFDLE9BQU8sT0FBTyxlQUFlO0lBQ2xDLE1BQU0sQ0FBQyxJQUFJO1FBQ1QsY0FBYyxDQUFDLElBQUksQ0FDakI7WUFDRSxFQUFFLEVBQUU7Z0JBQ0YsSUFBSSxFQUFFLFNBQVMsQ0FBQyxPQUFPO2dCQUN2QixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsU0FBUyxFQUFFLEtBQUs7YUFDakI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxFQUFFLFNBQVMsQ0FBQyxPQUFPO2dCQUN2QixTQUFTLEVBQUUsS0FBSzthQUNqQjtZQUNELFVBQVUsRUFBRTtnQkFDVixJQUFJLEVBQUUsU0FBUyxDQUFDLE9BQU87Z0JBQ3ZCLFNBQVMsRUFBRSxLQUFLO2FBQ2pCO1NBQ0YsRUFDRDtZQUNFLFNBQVMsRUFBRSxxQkFBcUI7WUFDaEMsVUFBVSxFQUFFLEtBQUs7WUFDakIsV0FBVyxFQUFFLElBQUk7WUFDakIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxTQUFTLEVBQWU7U0FDdkMsQ0FDRixDQUFDO1FBQ0YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2IsQ0FBQztJQUNELE1BQU0sQ0FBQyxnQkFBZ0IsS0FBSSxDQUFDO0NBQzdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gXCJkZWJ1Z1wiO1xyXG5pbXBvcnQgeyBEYXRhVHlwZXMsIE1vZGVsLCBTZXF1ZWxpemUgfSBmcm9tIFwic2VxdWVsaXplXCI7XHJcbmltcG9ydCBkYiBmcm9tIFwiLi4vLi4vZGJcIjtcclxuXHJcbmNvbnN0IGxvZyA9IGRlYnVnKFwiYXBpOm1vZGVsczpHZW5yZUJvb2tcIik7XHJcblxyXG5leHBvcnQgY2xhc3MgR2VucmVCb29rTW9kZWwgZXh0ZW5kcyBNb2RlbCB7fVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VucmVCb29rUmVjb3JkIHtcclxuICBzdGF0aWMgaW5pdCgpIHtcclxuICAgIEdlbnJlQm9va01vZGVsLmluaXQoXHJcbiAgICAgIHtcclxuICAgICAgICBpZDoge1xyXG4gICAgICAgICAgdHlwZTogRGF0YVR5cGVzLklOVEVHRVIsXHJcbiAgICAgICAgICBwcmltYXJ5S2V5OiB0cnVlLFxyXG4gICAgICAgICAgYWxsb3dOdWxsOiBmYWxzZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvb2tfaWQ6IHtcclxuICAgICAgICAgIHR5cGU6IERhdGFUeXBlcy5JTlRFR0VSLFxyXG4gICAgICAgICAgYWxsb3dOdWxsOiBmYWxzZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1YmplY3RfaWQ6IHtcclxuICAgICAgICAgIHR5cGU6IERhdGFUeXBlcy5JTlRFR0VSLFxyXG4gICAgICAgICAgYWxsb3dOdWxsOiBmYWxzZSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGFibGVOYW1lOiBcImJvb2tzX2Jvb2tfc3ViamVjdHNcIixcclxuICAgICAgICB0aW1lc3RhbXBzOiBmYWxzZSxcclxuICAgICAgICB1bmRlcnNjb3JlZDogdHJ1ZSxcclxuICAgICAgICBzZXF1ZWxpemU6IGRiLmdldERyaXZlcigpIGFzIFNlcXVlbGl6ZSxcclxuICAgICAgfVxyXG4gICAgKTtcclxuICAgIGxvZygnZG9uZScpXHJcbiAgfVxyXG4gIHN0YXRpYyBhZGRSZWxhdGlvbnNoaXBzKCkge31cclxufVxyXG4iXX0=