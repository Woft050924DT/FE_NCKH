import { describe, it, expect, beforeAll } from 'vitest';
import { authService } from '../src/services/authService';
import { thesisRoundsService } from '../src/services/thesisRoundsService';
import { instructorService } from '../src/services/instructorService';
import { topicService } from '../src/services/topicService';
import { topicRegistrationService } from '../src/services/topicRegistrationService';
import { reportService } from '../src/services/reportService';
import { apiClient } from '../src/services/apiClient';

// Helper to switch users
async function loginAs(username: string) {
  authService.clearAuth();
  const res = await authService.login({ username, password: '123' });
  return res.user;
}

describe('Frontend API Integration - Workflow', () => {
  let uniqueId = Date.now().toString().slice(-4);
  let kltnRound: any;
  let daRound: any;
  let proposedTopic: any;
  let giaovuUser: any;
  let instructorUser: any;
  let studentUser1: any;
  let studentUser2: any;
  let registrationDA: any;
  let registrationKLTN: any;

  it('1. Đăng nhập với giáo vụ và tạo đợt khóa luận', async () => {
    giaovuUser = await loginAs('giaovu');
    expect(giaovuUser).toBeDefined();

    try {
      kltnRound = await thesisRoundsService.createThesisRound({
        roundCode: `KLTN_FE_${uniqueId}`,
        roundName: `KLTN FE ${uniqueId}`,
        thesisTypeId: 1, // KLTN
        departmentId: 1,
        academicYear: uniqueId,
        semester: 1,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30*86400000).toISOString().split('T')[0]
      });
      expect(kltnRound).toBeDefined();
    } catch (e: any) {
      console.error('KLTN ERROR:', e.response?.data || e);
      throw e;
    }

    daRound = await thesisRoundsService.createThesisRound({
      roundCode: `DA_FE_${uniqueId}`,
      roundName: `Đồ án FE ${uniqueId}`,
      thesisTypeId: 2, // Đồ án
      departmentId: 1,
      academicYear: uniqueId,
      semester: 2,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30*86400000).toISOString().split('T')[0]
    });
    expect(daRound).toBeDefined();
    
    const kId = kltnRound.data?.id || kltnRound.id || (kltnRound as any).data?.[0]?.id;
    const dId = daRound.data?.id || daRound.id || (daRound as any).data?.[0]?.id;

    if (kId) await apiClient.patch(`/api/admin/thesis-rounds/${kId}/status`, { status: 'ACTIVE' });
    if (dId) await apiClient.patch(`/api/admin/thesis-rounds/${dId}/status`, { status: 'ACTIVE' });
  });

  it('2. Thêm giáo viên vào đợt Đồ án', async () => {
    // Get instructors list to find ID
    const instructors: any = await apiClient.get<any>('/api/v1/instructors');
    const targetInstructor = instructors.data?.[0] || instructors[0];

    const dId = daRound.data?.id || daRound.id || (daRound as any).data?.[0]?.id;
    
    // Gán giảng viên
    const assignRes = await thesisRoundsService.assignInstructors(dId, {
      instructorIds: [targetInstructor.id],
      supervisionQuota: 5
    });
    expect(assignRes).toBeDefined();
  });

  it('3. Giáo viên thêm đề tài vào đợt Đồ án', async () => {
    instructorUser = await loginAs('giaovien');

    const dId = daRound.data?.id || daRound.id || (daRound as any).data?.[0]?.id;

    // Create topic
    const topicRes: any = await topicService.createTopic({
      topic_code: `TP_FE_${uniqueId}`,
      topic_title: `Đề tài Đồ án FE ${uniqueId}`,
      topic_description: 'Test FE integration',
      thesis_round_id: dId,
      objectives: 'Test',
      student_requirements: 'Test'
    });
    proposedTopic = topicRes.data || topicRes;
    expect(proposedTopic).toBeDefined();
  });

  it('4. Sinh viên đăng ký đề tài KLTN', async () => {
    studentUser1 = await loginAs('hocsinh');

    const kId = kltnRound.data?.id || kltnRound.id || (kltnRound as any).data?.[0]?.id;

    // Tạo nhóm
    const groupRes: any = await apiClient.post<any>('/api/v1/thesis-groups', {
      group_code: `GRP_KLTN_${uniqueId}`,
      thesis_round_id: kId,
      members: [studentUser1.student_id]
    });
    
    const gId = groupRes.data?.id || groupRes.id;

    // Đăng ký đề tài
    const regRes: any = await topicRegistrationService.registerTopic({
      thesis_group_id: gId,
      thesis_round_id: kId,
      self_proposed_title: 'Đề tài tự do KLTN',
      instructor_id: proposedTopic?.instructor_id || 1 
    });
    registrationKLTN = regRes.data || regRes;
    expect(registrationKLTN).toBeDefined();
  });

  it('5. Sinh viên đăng ký đề tài Đồ án', async () => {
    studentUser2 = await loginAs('hocsinh2');

    const dId = daRound.data?.id || daRound.id || (daRound as any).data?.[0]?.id;

    // Tạo nhóm DA
    const groupRes: any = await apiClient.post<any>('/api/v1/thesis-groups', {
      group_code: `GRP_DA_${uniqueId}`,
      thesis_round_id: dId,
      members: [studentUser2.student_id]
    });
    
    const gId = groupRes.data?.id || groupRes.id;

    // Đăng ký đề tài
    const regRes: any = await topicRegistrationService.registerTopic({
      thesis_group_id: gId,
      thesis_round_id: dId,
      proposed_topic_id: proposedTopic.id,
      instructor_id: proposedTopic.instructor_id
    });
    registrationDA = regRes.data || regRes;
    expect(registrationDA).toBeDefined();
  });

  it('6. Giảng viên và Trưởng BM duyệt đề tài', async () => {
    // Giảng viên duyệt
    await loginAs('giaovien');
    const approveInstKLTN = await topicRegistrationService.approveByInstructor(registrationKLTN.id);
    expect(approveInstKLTN).toBeDefined();
    
    const approveInstDA = await topicRegistrationService.approveByInstructor(registrationDA.id);
    expect(approveInstDA).toBeDefined();

    // Trưởng bộ môn duyệt KLTN
    await loginAs('truongbomon');
    const approveTBM = await apiClient.post<any>(`/api/v1/topic-registrations/${registrationKLTN.id}/approve/department-head`);
    expect(approveTBM).toBeDefined();
  });

  it('7. Sinh viên nộp báo cáo và giảng viên chấm', async () => {
    await loginAs('hocsinh2');
    
    const studentTheses: any = await apiClient.get<any>(`/api/v1/thesis/thesis/my-registrations`);
    const dataList = studentTheses.data || studentTheses;
    const myThesis = dataList.find((t: any) => t.topic_registration_id === registrationDA.id || t.id === registrationDA.id);
    
    if (myThesis) {
      // Submit report
      const submitRes: any = await reportService.submitWeeklyReport(myThesis.id || myThesis.thesis_id, {
        weekNumber: 1,
        workCompleted: 'Hoàn thành login',
        resultsAchieved: 'Xong test',
        difficultiesEncountered: 'Không',
        nextWeekPlan: 'Nộp test',
        studentId: studentUser2.id
      } as any);
      expect(submitRes).toBeDefined();

      const rId = submitRes.data?.id || submitRes.id;

      // Giảng viên chấm
      await loginAs('giaovien');
      const gradeRes = await reportService.provideWeeklyReportFeedback(rId, {
        feedback: 'Giỏi',
        status: 'APPROVED'
      });
      expect(gradeRes).toBeDefined();
    }
  });
});
