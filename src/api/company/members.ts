import { CreateMember, UpdateMemberDto, MemberDto } from "@/types/company";

import axiosInstance from "../axiosInstance";

export const createMember = async (data: CreateMember) => {
  try {
    await axiosInstance.post(`/company/members`, data);
  } catch (err) {
    throw err;
  }
};

export const updateMember = async (data: UpdateMemberDto, memberId: number) => {
  try {
    await axiosInstance.patch(`/company/members/${memberId}`, data);
  } catch (err) {
    throw err;
  }
};

export const getMember = async (memberId: number) => {
  try {
    const { data } = await axiosInstance.get(`/company/members/${memberId}`);

    return data as MemberDto;
  } catch (err) {
    throw err;
  }
};

export const getMembers = async () => {
  try {
    const { data } = await axiosInstance.get(`/company/members`);

    return data as MemberDto[];
  } catch (err) {
    throw err;
  }
};

export const deleteMember = async (memberId: number) => {
  try {
    await axiosInstance.delete(`/company/members/${memberId}`);
  } catch (err) {
    throw err;
  }
};

export const getMembersFor = async () => {
  try {
    const { data } = await axiosInstance.get(`/members-for`);

    return data as MemberDto[];
  } catch (err) {
    throw err;
  }
};
