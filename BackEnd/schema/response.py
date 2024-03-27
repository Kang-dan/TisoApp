from pydantic import BaseModel
from repository.orm import ShelterPath

class PingPongSchema(BaseModel):
    message : str ="Hello World"

class ShelterPathSchema(BaseModel):
    path: list[dict[str,float]] = [
                                    {"latitude":37.123,"longitude":127.233},
                                    {"latitude":37.345,"longitude":127.567},
                                    {"latitude":37.678,"longitude":127.789}
                                ]
    distance: float = 1001.53125

    @classmethod
    def from_orm_to_schema(cls,orm_shelter_path:ShelterPath):
        path=[{"latitude":latitude,"longitude":longitude} for [latitude,longitude] in orm_shelter_path.path]
        distance=orm_shelter_path.distance
        return cls(path=path,distance=distance)
    

class ShelterInfoSchema(BaseModel):
    shelterId: str = "65fd1f64a1c2102da599cf79"
    name: str = "구암역 대전1호선 지하역사(지하1층)"
    address: str = "대전광역시 유성구 유성대로 703 (구암동)"
    capacity: int = 1989
    latitude: float = 36.35652933
    longitude: float = 127.3310839
    type: str = "S2"


class ShelterRespSchema(BaseModel):
    #status 는 내부 코드입니다.
    status: int = 2000
    data : dict[str,list[ShelterInfoSchema]] = {
        "shelterList":[ShelterInfoSchema(),ShelterInfoSchema(),ShelterInfoSchema()]
    }


class PathRespSchema(BaseModel):
    status: int = 2000
    data : ShelterPathSchema = ShelterPathSchema()