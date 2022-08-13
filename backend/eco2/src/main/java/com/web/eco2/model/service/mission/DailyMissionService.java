package com.web.eco2.model.service.mission;

import com.web.eco2.domain.dto.item.CalendarDto;
import com.web.eco2.domain.dto.mission.UltraShortNowcast;
import com.web.eco2.domain.entity.mission.DailyMission;
import com.web.eco2.domain.entity.mission.Mission;
import com.web.eco2.domain.entity.user.User;
import com.web.eco2.model.repository.mission.DailyMissionRepository;
import com.web.eco2.model.repository.mission.MissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

@Service
public class DailyMissionService {
    @Autowired
    private WeatherService weatherService;
    @Autowired
    private MissionRepository missionRepository;

    @Autowired
    private DailyMissionRepository dailyMissionRepository;
    @Value("${reward.path}")
    private String uploadFolder;

    public void save(DailyMission dailyMission) {
        dailyMissionRepository.save(dailyMission);
    }

    public List<DailyMission> findListByUsrId(Long usrId) {
        return dailyMissionRepository.findListByUsrId(usrId);
    }

    public List<DailyMission> findCustomListByUsrId(Long usrId) {
        return dailyMissionRepository.findCustomListByUsrId(usrId);
    }

    public DailyMission findListByUsrIdAndMisId(Long usrId, Long missionId) {
        return dailyMissionRepository.findListByUsrIdAndMisId(usrId, missionId);

    }

    public DailyMission findListByUsrIdAndCumId(Long usrId, Long missionId) {
        return dailyMissionRepository.findListByUsrIdAndCumId(usrId, missionId);
    }

    public void delete(DailyMission dailyMission) {
        dailyMissionRepository.delete(dailyMission);
    }


    public List<DailyMission> findRewardList(Long usrId) {
        return dailyMissionRepository.findRewardList(usrId);
    }

    public BufferedImage getRewardImage(User user, CalendarDto calendarDto) throws IOException {
        List<DailyMission> dailyMissionList = findRewardList(user.getId());

        BufferedImage img = ImageIO.read(new File(uploadFolder + "/rewardImage.jpg"));
        Graphics2D graphics = img.createGraphics();
        String rewardFontName = "한컴 울주 반구대 암각화체";
        String rewardDate = calendarDto.getDate().format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일"));
        String rewardName = user.getName() + "님";
        String rewardContent1 = "오늘의 데일리미션 완료!!";
        String rewardContent2 = "축하합니다!!";
        String rewardFooter = "ECO2";

        String rewardMission1 = dailyMissionList.get(0).getMission().getTitle();
        String rewardMission2 = dailyMissionList.get(1).getMission().getTitle();
        String rewardMission3 = dailyMissionList.get(2).getMission().getTitle();


        Font font = new Font(rewardFontName, Font.BOLD, 25);
        graphics.setFont(font);
        graphics.setColor(Color.DARK_GRAY);
        FontMetrics metrics = graphics.getFontMetrics(font);

        int width = metrics.stringWidth(rewardDate);
        graphics.drawString(rewardDate, 500 / 2 - width / 2, 65);

        width = metrics.stringWidth(rewardFooter);
        graphics.drawString(rewardFooter, 500 / 2 - width / 2, 870);

        width = metrics.stringWidth(rewardMission1);
        graphics.drawString(rewardMission1, 125, 645);
        width = metrics.stringWidth(rewardMission2);
        graphics.drawString(rewardMission2, 125, 720);
        width = metrics.stringWidth(rewardMission3);
        graphics.drawString(rewardMission3, 125, 798);

        font = new Font(rewardFontName, Font.BOLD, 32);
        graphics.setFont(font);
        metrics = graphics.getFontMetrics(font);
        width = metrics.stringWidth(rewardContent1);
        graphics.drawString(rewardContent1, 500 / 2 - width / 2, 110);

        font = new Font(rewardFontName, Font.BOLD, 60);
        graphics.setFont(font);
        metrics = graphics.getFontMetrics(font);
        width = metrics.stringWidth(rewardName);
        graphics.drawString(rewardName, 500 / 2 - width / 2, 235);

        width = metrics.stringWidth(rewardContent2);
        graphics.drawString(rewardContent2, 500 / 2 - width / 2, 320);

        return img;
    }

    public CalendarDto getCalendarDto(User user) {
        CalendarDto calendarDto = new CalendarDto(user);
        UUID uuid = UUID.randomUUID();
        String saveName = uuid.toString() + calendarDto.getDate() + calendarDto.getUser().getEmail();
        calendarDto.setSaveName(saveName);
        calendarDto.setSaveFolder(uploadFolder);
        return calendarDto;
    }

    public void deleteByUsrId(Long usrId) {
        dailyMissionRepository.deleteByUsrId(usrId);
    }
    // TODO: 알고리즘 고치기
    // 에어컨/난방 미션의 경우의 처리가 미흡. 플래그 추가 생각 중
    public Map<String, List<?>> getRecommendMission(String lat, String lng, String time) throws IOException {
        List<Long> recommendMissionsNum = new ArrayList<>();
        List<Mission> recommendMission = new ArrayList<>();

        UltraShortNowcast ultraShortNowcast = weatherService.getUltraSrtNcst(lat, lng, time);
        if(ultraShortNowcast == null) {
            return null;
        }

        Boolean isClear = null;
        if(ultraShortNowcast.getRainAmount() <= 0 && ultraShortNowcast.getTemperature() >= 18 && ultraShortNowcast.getTemperature() <= 26) {
            isClear = true;
        } else if (ultraShortNowcast.getRainAmount() >= 3 || ultraShortNowcast.getTemperature() <= 15 || ultraShortNowcast.getTemperature() >= 28) {
            isClear = false;
        }

        List<Mission> missions = new ArrayList<>();
        Random random = new Random();
        int num = random.nextInt(3) + 1;
        num = (4 + num) % 5; // 카테고리 4(구매하기) 제외하고 제외할 카테고리 하나 더 선택
        if(num == 0) num = 5;

        if(isClear != null) missions.addAll(missionRepository.findWithoutCategoryAndClearFlag(4, num, isClear));
        else missions.addAll(missionRepository.findWithoutCategory(4, num));

        while (recommendMissionsNum.size() < 3) {
            num = random.nextInt(missions.size() - 1) + 1;
            if (!recommendMissionsNum.contains(missions.get(num).getId())) {
                recommendMissionsNum.add(missions.get(num).getId());
                recommendMission.add(missions.get(num));
            }
            missions.remove(num);
        }

        Map<String, List<?>> map = new HashMap<>();
        map.put("missions", recommendMission);
        map.put("missionsNum", recommendMissionsNum);
        return map;
    }

    public DailyMission getById(Long missionId) {
        return dailyMissionRepository.getById(missionId);
    }
}