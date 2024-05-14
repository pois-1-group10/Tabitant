from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    image = models.ImageField(upload_to="%Y/%m%d/", verbose_name="アイコン")

    class Meta:
        verbose_name = "ユーザー"
        verbose_name_plural = "ユーザー"

###山本作業分Award
from django.db import models
from django.utils.translation import gettext_lazy as _

class Award(models.Model):
    user_id = models.IntegerField(verbose_name=_("ユーザーID"))
    tanka_id = models.IntegerField(verbose_name=_("短歌ID"))
    compe_id = models.IntegerField(verbose_name=_("競技ID"))
    rank = models.IntegerField(verbose_name=_("順位"))

    class Meta:
        verbose_name = "受賞"
        verbose_name_plural = "受賞一覧"

    def __str__(self):
        return f"Award {self.id}"


####山本作業分Competition
from django.db import models
from django.utils.translation import gettext_lazy as _

class Competition(models.Model):
    prefecture_id = models.IntegerField(verbose_name=_("都道府県ID"))
    year = models.IntegerField(verbose_name=_("年"))
    month = models.IntegerField(verbose_name=_("月"))

    class Meta:
        verbose_name = "競技"
        verbose_name_plural = "競技一覧"

    def __str__(self):
        return f"Competition {self.id}"


####山本作業分Prefecture
from django.db import models

class Prefecture(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, verbose_name="都道府県")

    class Meta:
        verbose_name = "都道府県"
        verbose_name_plural = "都道府県"


# AwardからCompetitionへのアクセス
award = Award.objects.get(pk=1)
competition = award.compe_id  # AwardオブジェクトからCompetitionオブジェクトへのアクセス

# CompetitionからPrefectureへのアクセス
competition = Competition.objects.get(pk=1)
prefecture = competition.prefecture_id  # CompetitionオブジェクトからPrefectureオブジェクトへのアクセス
