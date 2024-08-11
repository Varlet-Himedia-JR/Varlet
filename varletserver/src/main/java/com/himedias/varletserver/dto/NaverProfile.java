package com.himedias.varletserver.dto;

public class NaverProfile {
    private String id;

    public String getId() {
        return id;
    }

    private NaverProfile.NaverAccount naver_account;

    public NaverAccount getAccount() {
        return naver_account;
    }

    public class NaverAccount {

        private NaverProfile.NaverAccount.Profile profile;
        private String email;
        private boolean has_email;

        public  NaverProfile.NaverAccount.Profile getProfile() {
            return profile;
        }

        public void setProfile(NaverProfile.NaverAccount.Profile profile) {
            this.profile = profile;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public boolean isHas_email() {
            return has_email;
        }

        public void setHas_email(boolean has_email) {
            this.has_email = has_email;
        }

        public class Profile {
            private String nickname;
            private String profile_image_url;

            public String getNickname() {
                return nickname;
            }

            public void setNickname(String nickname) {
                this.nickname = nickname;
            }

            public String getProfile_image_url() {
                return profile_image_url;
            }

            public void setProfile_image_url(String profile_image_url) {
                this.profile_image_url = profile_image_url;
            }

        }
    }
}

