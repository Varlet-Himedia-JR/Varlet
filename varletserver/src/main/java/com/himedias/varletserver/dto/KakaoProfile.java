package com.himedias.varletserver.dto;

public class KakaoProfile {

    private String id;

    public String getId() {
        return id;
    }

    private KakaoAccount kakao_account;

    public KakaoAccount getAccount() {
        return kakao_account;
    }

    public class KakaoAccount {

        private Profile profile;
        private String email;
        private boolean has_email;

        public Profile getProfile() {
            return profile;
        }

        public void setProfile(Profile profile) {
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
