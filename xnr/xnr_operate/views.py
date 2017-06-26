-*- coding:utf-8 -*-
import os
import time
import json
from flask import Blueprint. url_for, render_template, request,\
                  abort, flash, session, redirect

from xnr.global_utils import es_flow_text


mod = Blueprint('operate', __name__, url_prefix='/operate')


@mod.route('/submit_daily_tweet/')
def ajax_submit_daily_tweet():
    return json.dumps(result)
