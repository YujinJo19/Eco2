package com.web.eco2.controller.mission;

import com.web.eco2.domain.dto.item.CalendarDto;
import com.web.eco2.domain.dto.mission.CustomMissionDto;
import com.web.eco2.domain.dto.mission.DailyMissionRecommendRequest;
import com.web.eco2.domain.dto.mission.DailyMissionRequest;
import com.web.eco2.domain.dto.mission.MissionDto;
import com.web.eco2.domain.entity.calender.Calendar;
import com.web.eco2.domain.entity.mission.CustomMission;
import com.web.eco2.domain.entity.mission.DailyMission;
import com.web.eco2.domain.entity.mission.Mission;
import com.web.eco2.domain.entity.mission.Trending;
import com.web.eco2.domain.entity.user.User;
import com.web.eco2.model.service.item.CalendarService;
import com.web.eco2.model.service.mission.*;
import com.web.eco2.model.service.user.RedisService;
import com.web.eco2.model.service.user.UserService;
import com.web.eco2.util.ResponseHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/daily")
@Transactional
public class DailyMissionController {
    @Autowired
    private UserService userService;

    @Autowired
    private MissionService missionService;
    @Autowired
    private CustomMissionService customMissionService;
    @Autowired
    private DailyMissionService dailyMissionService;
    @Autowired
    private TrendingService trendingService;
    @Autowired
    private CalendarService calendarService;
    @Autowired
    private RedisService redisService;
    @Autowired
    private WeatherService weatherService;

    //데일리 미션 등록
    @PostMapping("/{usrId}")
    public ResponseEntity<Object> registerDailyMission(@PathVariable("usrId") Long usrId, @RequestBody DailyMissionRequest dailyMissionRequest) {
        try {
            User user = userService.getById(usrId);
            if (dailyMissionRequest.getDailyMissionList() != null) {
                for (Long missionId : dailyMissionRequest.getDailyMissionList()) {
                    System.out.println(missionId);
                    Mission mission = missionService.findByMisId(missionId);
                    DailyMission dailyMission = dailyMissionRequest.toEntity(user, mission, null);
                    trendingService.updateCount(dailyMission.getMission().getId());
                    dailyMissionService.save(dailyMission);
                }
            }
            if (dailyMissionRequest.getCustomMissionList() != null) {
                for (Long customMissionId : dailyMissionRequest.getCustomMissionList()) {
                    System.out.println(customMissionId);
                    CustomMission customMission = customMissionService.findByCumId(customMissionId);
                    DailyMission dailyMission = dailyMissionRequest.toEntity(user, null, customMission);
                    dailyMissionService.save(dailyMission);
                }
            }
            return ResponseHandler.generateResponse("데일리 미션이 등록되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseHandler.generateResponse("요청에 실패하였습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    //데일리 미션 조회
    @GetMapping("/{usrId}")
    public ResponseEntity<Object> selectDailyMission(@PathVariable("usrId") Long usrId) {
        try {
            List<DailyMission> dailyMissionList = dailyMissionService.findListByUsrId(usrId);
            List<DailyMission> dailyCustomMissionList = dailyMissionService.findCustomListByUsrId(usrId);
            System.out.println(dailyMissionList);
            System.out.println(dailyCustomMissionList);
            return ResponseHandler.generateResponse("데일리 미션이 조회되었습니다.", HttpStatus.OK, "dailyMissionList", dailyMissionList, "dailyCustomMissionList", dailyCustomMissionList);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("요청에 실패하였습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    //데일리 미션 삭제
    @DeleteMapping("/{usrId}")
    public ResponseEntity<Object> deleteDailyMission(@PathVariable("usrId") Long usrId, @RequestBody DailyMissionRequest dailyMissionRequest) {
        try {
            DailyMission dailyMission;
            if (dailyMissionRequest.getMissionType() == 0) {
                //기본미션 삭제
                dailyMission = dailyMissionService.findListByUsrIdAndMisId(usrId, dailyMissionRequest.getMissionId());
                trendingService.reduceCount(dailyMission.getId());
            } else {
                dailyMission = dailyMissionService.findListByUsrIdAndCumId(usrId, dailyMissionRequest.getMissionId());
            }
            System.out.println(dailyMission);
            dailyMissionService.delete(dailyMission);
            return ResponseHandler.generateResponse("데일리 미션이 삭제되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            return ResponseHandler.generateResponse("요청에 실패하였습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    //데일리 미션 완료
    @PutMapping("/{usrId}")
    public ResponseEntity<Object> completeDailyMission(@PathVariable("usrId") Long usrId, @RequestBody DailyMissionRequest dailyMissionRequest) {
        try {
            DailyMission dailyMission;
            if (dailyMissionRequest.getMissionType() == 0) {
                //기본미션
                dailyMission = dailyMissionService.findListByUsrIdAndMisId(usrId, dailyMissionRequest.getMissionId());
            } else {
                dailyMission = dailyMissionService.findListByUsrIdAndCumId(usrId, dailyMissionRequest.getMissionId());
            }
            dailyMission.setAchieveFlag(true);
            dailyMissionService.save(dailyMission);
            return ResponseHandler.generateResponse("데일리 미션이 완료되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseHandler.generateResponse("요청에 실패하였습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    //데일리 미션 보상 받기
    @PostMapping("/reward/{usrId}")
    public ResponseEntity<Object> rewardDailyMission(@PathVariable("usrId") Long usrId) {
        try {
            User user = userService.getById(usrId);
            CalendarDto calendarDto = dailyMissionService.getCalendarDto(user);
            System.out.println(calendarDto);
            //보상 이미지 생성
            BufferedImage img = dailyMissionService.getRewardImage(user, calendarDto);

            //디비, 로컬에 파일 저장
            File saveFile = new File(calendarDto.getSaveFolder() + "/" + calendarDto.getSaveName() + ".jpg");
            ImageIO.write(img, "jpg", saveFile);               // write메소드를 이용해 파일을 만든다
            calendarService.save(calendarDto.toEntity());
            //TODO : 프론트에서 이미지 출력시 뭐 필요한지 모름,, response에 담아주기

            return ResponseHandler.generateResponse("보상 이미지 제공이 완료되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseHandler.generateResponse("요청에 실패하였습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    //보상이미지 조회
    @GetMapping("/reward/{calId}")
    public ResponseEntity<Object> selectRewardImage(@PathVariable("calId") Long calId) {
        try {
            //TODO: 프론트에서 이미지 출력할때 뭐 필요한지 모르겠다 구현하기!!
            Optional<Calendar> calendar = calendarService.getById(calId);
            System.out.println(calendar);
            return ResponseHandler.generateResponse("미션 보상이미지가 조회되었습니다.", HttpStatus.OK, "calendar", calendar);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseHandler.generateResponse("요청에 실패하였습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    //특정일자 미션 보상 여부
    @GetMapping("/reward/check/{usrId}")
    public ResponseEntity<Object> selectRewardImage(@PathVariable("usrId") Long usrId, @RequestBody DailyMissionRecommendRequest dailyMissionRecommendRequest) {
        try {
            Calendar calendar = calendarService.findByUsrIdAndDate(usrId, dailyMissionRecommendRequest.getDate());
            boolean rewardFlag = true;
            if (calendar == null) {
                rewardFlag = false;
            }
            return ResponseHandler.generateResponse("특정일자 미션 보상 여부가 조회되었습니다.", HttpStatus.OK, "rewardFlag", rewardFlag);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseHandler.generateResponse("요청에 실패하였습니다.", HttpStatus.BAD_REQUEST);

        }
    }

    //데일리 미션 추천
    @PostMapping("/recommend/{usrId}")
    public ResponseEntity<Object> recommendDailyMission(@PathVariable("usrId") Long usrId, @RequestBody DailyMissionRecommendRequest dailyMissionRecommendRequest) {
        try {
            List<Long> oldRecommendMission = redisService.getListData(usrId.toString());
            if (oldRecommendMission != null) {
                System.out.println("이미 추천함");
                return ResponseHandler.generateResponse("데일리 미션 추천이 완료되었습니다.", HttpStatus.OK,
                        "recommendedMission",
                        oldRecommendMission.stream()
                                .map(missionId -> missionService.findByMisId(missionId))
                                .collect(Collectors.toList())
                );
            }
            // 리셋
            dailyMissionService.deleteByUsrId(usrId);

            Map<String, List<?>> missionData = dailyMissionService.getRecommendMission(dailyMissionRecommendRequest.getLat(), dailyMissionRecommendRequest.getLng(), dailyMissionRecommendRequest.getDate());

            //위치 받아와서 추천 목록 생성
            List<Mission> missions = (List<Mission>) missionData.get("missions");
            //디비에 넣기
            for (Mission m : missions) {
                dailyMissionService.save(DailyMission.builder()
                        .user(User.builder().id(usrId).build()).mission(m).build());
            }

            LocalDateTime now = LocalDateTime.now();
            System.out.println(now.toString());
            LocalDateTime expireTime = LocalDateTime.parse(now.plusHours(18L).toString().substring(0, 11)+"06:00");
            // 6시에 새로고침
            Long duration = expireTime.toEpochSecond(ZoneOffset.UTC) - now.toEpochSecond(ZoneOffset.UTC);
            if(duration <= 0) duration = 1L;
            redisService.setListDataExpire(usrId.toString(), (List<Long>) missionData.get("missionsNum"), duration);

            return ResponseHandler.generateResponse("데일리 미션 추천이 완료되었습니다.", HttpStatus.OK, "recommendedMission", missions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseHandler.generateResponse("요청에 실패하였습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    //트렌딩 조회
    @GetMapping("/trending")
    public ResponseEntity<Object> selectTreding() {
        try {
            List<Trending> trendingList = trendingService.findTop5List();
            System.out.println(trendingList);
            return ResponseHandler.generateResponse("트렌딩 조회되었습니다.", HttpStatus.OK, "trendingList", trendingList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseHandler.generateResponse("요청에 실패하였습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    //캘린더 조회
    @GetMapping("/calendar/{usrId}")
    public ResponseEntity<Object> selectCalendar(@PathVariable("usrId") Long usrId) {
        try {
            User user = userService.getById(usrId);
            List<Calendar> calendarList = calendarService.findByUsrId(usrId);
            System.out.println(calendarList);
            return ResponseHandler.generateResponse("캘린더 조회되었습니다.", HttpStatus.OK, "calendarList", calendarList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseHandler.generateResponse("요청에 실패하였습니다.", HttpStatus.BAD_REQUEST);
        }
    }


}
